import { run } from 'multiverse/run';
import { CliError, ErrorMessage } from './errors';
import { getRunContext } from 'pkgverse/core/src/project-utils';
import { access } from 'fs/promises';
import { glob } from 'glob';
import { promisify } from 'util';
import { toss } from 'toss-expression';
import { readFile } from 'fs/promises';
import semver from 'semver';
import browserslist from 'browserslist';
import stripAnsi from 'strip-ansi';
import chalk from 'chalk';

import {
  PackageJsonNotFoundError,
  BadPackageJsonError,
  NotAGitRepositoryError,
  DuplicatePackageIdError,
  DuplicatePackageNameError
} from 'pkgverse/core/src/errors';

import {
  globalPkgJsonRequiredFields,
  monorepoRootTsconfigFiles,
  nonMonoRootPkgJsonRequiredFields,
  numLinesToConsider,
  pkgJsonLicense,
  pkgJsonObsoleteEntryKeys,
  pkgJsonRequiredExports,
  pkgJsonRequiredFiles,
  pkgVersionWhitelist,
  polyrepoTsconfigFiles,
  publicPkgJsonRequiredFields,
  requiredFiles,
  subRootTsconfigFiles
} from './constants';

import type { PackageJson } from 'type-fest';

const getRemark = () => import('mdast-util-from-markdown');

const globAsync = promisify(glob);

type UnifiedReturnType = Promise<{
  success: boolean;
  output: string | undefined;
  summary: string;
}>;

type ExportsPaths = { paths: string[]; fullPath: string[] };

type ReporterFactory = (
  currentFile: string
) => (type: ReportType, message: string) => void;

type ReportType = 'warn' | 'error';

/**
 * Filters out empty and debug lines from linter output.
 *
 * Until something is done about https://github.com/nodejs/node/issues/34799, we
 * unfortunately have to remove the annoying debugging lines manually...
 */
const ignoreEmptyAndDebugLines = (line: string) => {
  return (
    stripAnsi(line) &&
    line != 'Debugger attached.' &&
    line != 'Waiting for the debugger to disconnect...'
  );
};

/**
 * Accepts the `lastLine` of linter output and the result of `RegExp.exec` where
 * the `errors` and `warning` capture groups have been defined and returns a
 * normalized summary of the number of errors and warnings that occurred.
 */
const summarizeOutput = (
  exitCode: number,
  lastLine: string,
  lastLineMeta: ReturnType<RegExp['exec']>
) => {
  const errors = parseInt(lastLineMeta?.groups?.errors || '0');
  const warnings = parseInt(lastLineMeta?.groups?.warnings || '0');

  return !lastLine
    ? exitCode == 0
      ? 'no issues'
      : 'unknown issue'
    : errors + warnings
    ? `${errors} error${errors != 1 ? 's' : ''}, ${warnings} warning${
        warnings != 1 ? 's' : ''
      }`
    : '1 error, 0 warnings';
};

/**
 * Flatten the package.json `"exports"` field into an array of entry points.
 */
const deepFlat = (
  o: NonNullable<PackageJson['exports']>,
  fullPath: string[] = []
): ExportsPaths[] => {
  return typeof o == 'string'
    ? [{ paths: [o], fullPath }]
    : !o || Array.isArray(o)
    ? [{ paths: o, fullPath }]
    : Object.entries(o).flatMap(([k, v]) => deepFlat(v, [...fullPath, k]));
};

/**
 * Check if a list of `files` (paths relative to `root`) exist.
 */
const checkFilesExist = (
  files: readonly string[],
  root: string,
  reporterFactory: ReporterFactory,
  type: ReportType = 'error'
) => {
  return Promise.all(
    files.map(async (file) => {
      const filePath = `${root}/${file}`;
      try {
        await access(filePath);
      } catch {
        reporterFactory(filePath)(type, ErrorMessage.MissingFile());
      }
    })
  );
};

/**
 * Checks a project or package for structural correctness, adherence to standard
 * practices, and avoidance of certain anti-patterns. The project's package.json
 * file will also be validated.
 */
export async function runProjectLinter({
  rootDir
}: {
  /**
   * The project or a package root directory. Must contain a package.json file.
   */
  rootDir: string;
}): UnifiedReturnType {
  try {
    const outputTree: { [filename: string]: string[] } = {};

    let errorCount = 0;
    let warnCount = 0;

    /**
     * Log an error or a warning
     */
    const reporterFactory: ReporterFactory = (currentFile) => (type, message) => {
      type == 'warn' ? warnCount++ : errorCount++;
      if (!outputTree[currentFile]) outputTree[currentFile] = [];
      outputTree[currentFile].push(
        `${
          type == 'warn'
            ? chalk.hex('#340343').bgYellow(' warn ')
            : chalk.hex('#340343').bgRed(' ERR! ')
        } ${message}`
      );
    };

    const ctx = (() => {
      try {
        // ? Technically we could accept cwd instead of forcing rootDir, but
        // ? accepting a cwd would not align with the other linter interfaces...
        return getRunContext({ cwd: rootDir });
      } catch (e) {
        if (e instanceof PackageJsonNotFoundError) {
          reporterFactory(`${rootDir}/package.json`)(
            'error',
            ErrorMessage.FatalMissingFile()
          );
        } else if (e instanceof BadPackageJsonError) {
          reporterFactory(e.packageJsonPath)(
            'error',
            ErrorMessage.PackageJsonUnparsable()
          );
        } else if (e instanceof NotAGitRepositoryError) {
          reporterFactory(rootDir)('error', ErrorMessage.NotAGitRepository());
        } else if (e instanceof DuplicatePackageIdError) {
          reporterFactory(e.firstPath)(
            'error',
            ErrorMessage.DuplicatePackageId(e.id, e.secondPath)
          );
          reporterFactory(e.secondPath)(
            'error',
            ErrorMessage.DuplicatePackageId(e.id, e.firstPath)
          );
        } else if (e instanceof DuplicatePackageNameError) {
          reporterFactory(e.firstPath)(
            'error',
            ErrorMessage.DuplicatePackageName(e.pkgName, e.secondPath)
          );
          reporterFactory(e.secondPath)(
            'error',
            ErrorMessage.DuplicatePackageName(e.pkgName, e.firstPath)
          );
        } else {
          throw e;
        }

        return undefined;
      }
    })();

    // ? Checks are performed asynchronously
    const tasks: Promise<unknown>[] = [];

    // ? Some checks are performed regardless of context
    if (ctx !== undefined) {
      const startedAtMonorepoRoot = ctx.context == 'monorepo' && !ctx.package;

      /**
       * Shared checks across monorepo/polyrepo roots and sub-roots
       */
      const rootAndSubRootChecks = async ({
        root,
        json,
        isCheckingMonorepoRoot
      }: {
        root: string;
        json: PackageJson;
        isCheckingMonorepoRoot: boolean;
      }) => {
        const report = reporterFactory(`${root}/package.json`);

        // ? package.json must have required fields
        globalPkgJsonRequiredFields.forEach((field) => {
          if (json[field] === undefined) {
            report('error', ErrorMessage.PackageJsonMissingKey(field));
          }
        });

        // ? package.json must have required fields (if not a monorepo root)
        if (!isCheckingMonorepoRoot) {
          nonMonoRootPkgJsonRequiredFields.forEach((field) => {
            if (json[field] === undefined) {
              report('error', ErrorMessage.PackageJsonMissingKey(field));
            }
          });

          // ? package.json must also have required fields (if not "private")
          if (!json.private) {
            publicPkgJsonRequiredFields.forEach((field) => {
              if (json[field] === undefined) {
                report('error', ErrorMessage.PackageJsonMissingKey(field));
              }
            });
          }
        }

        // ? No duplicate dependencies
        if (json.dependencies && json.devDependencies) {
          const devDeps = Object.keys(json.devDependencies);
          Object.keys(json.dependencies)
            .filter((d) => devDeps.includes(d))
            .forEach((dep) => {
              report('error', ErrorMessage.PackageJsonDuplicateDependency(dep));
            });
        }

        // ? Has baseline distributable contents whitelist
        if (json.files) {
          pkgJsonRequiredFiles.forEach((file) => {
            if (!json.files?.includes(file)) {
              report('error', ErrorMessage.PackageJsonMissingValue('files', file));
            }
          });
        }

        // ? Has standard entry points
        if (json.exports !== undefined) {
          const xports =
            !json.exports ||
            typeof json.exports == 'string' ||
            Array.isArray(json.exports)
              ? {}
              : json.exports;

          const entryPoints = Object.keys(xports);

          pkgJsonRequiredExports.forEach((requiredEntryPoint) => {
            if (!entryPoints.includes(requiredEntryPoint)) {
              report(
                'error',
                ErrorMessage.PackageJsonMissingEntryPoint(requiredEntryPoint)
              );
            }
          });

          const distPaths = entryPoints.flatMap((entryPoint) =>
            deepFlat(xports[entryPoint], [entryPoint])
          );

          // ? Entry points exist
          distPaths.forEach(({ paths, fullPath }) => {
            tasks.push(
              (async () => {
                const results = await Promise.all(
                  paths.map((path) => {
                    return globAsync(path, {
                      cwd: root,
                      ignore: ['**/node_modules/**']
                    }).then((files) => !!files.length);
                  })
                );

                if (!results.some(Boolean)) {
                  report('error', ErrorMessage.PackageJsonBadEntryPoint(fullPath));
                }
              })()
            );
          });
        }

        // ? Types entry points exist
        if (json.typesVersions) {
          Object.entries(json.typesVersions).forEach(([version, spec]) => {
            Object.entries(spec).forEach(([alias, paths]) => {
              tasks.push(
                (async () => {
                  const results = await Promise.all(
                    paths.map((path) => {
                      return globAsync(path, {
                        cwd: root,
                        ignore: ['**/node_modules/**']
                      }).then((files) => !!files.length);
                    })
                  );

                  if (!results.some(Boolean)) {
                    report(
                      'error',
                      ErrorMessage.PackageJsonBadTypesEntryPoint([version, alias])
                    );
                  }
                })()
              );
            });
          });
        }

        // ? No .tsbuildinfo files allowed under dist
        tasks.push(
          (async () => {
            const files = await globAsync('dist/**/*.tsbuildinfo', {
              cwd: root,
              absolute: true,
              ignore: ['**/node_modules/**']
            });

            for (const filePath of files) {
              reporterFactory(filePath)(
                'error',
                ErrorMessage.IllegalItemInDirectory(`${root}/dist`)
              );
            }
          })()
        );

        // ? Has required files
        tasks.push(checkFilesExist(requiredFiles, root, reporterFactory));

        // ? Has no unpublished fixup/mergeme commits
        tasks.push(
          (async () => {
            const status = await run('git', ['status', '-sb'], { reject: true });
            const rawRefs = status.stdout.split('\n')[0];

            // ? Repos not tracking upstream won't return "..."
            if (rawRefs.includes('...')) {
              const refs = rawRefs.split(' ').at(-1) || toss(new CliError(2));
              const commits = await run(
                'git',
                ['log', '--oneline', refs, '--grep', 'fixup', '--grep', 'mergeme'],
                { reject: true }
              );

              commits.stdout
                .split('\n')
                .filter(Boolean)
                .forEach((commit) => {
                  const sha = commit.split(' ')[0];
                  reporterFactory(`git commit ${sha}`)(
                    'error',
                    ErrorMessage.CommitNeedsFixup()
                  );
                });
            }
          })()
        );

        // ? Has correct license
        if (json.license != pkgJsonLicense) {
          report('warn', ErrorMessage.PackageJsonMissingValue('license', pkgJsonLicense));
        }

        // ? Has non-experimental non-whitelisted version
        if (
          json.version &&
          !pkgVersionWhitelist.includes(
            json.version as typeof pkgVersionWhitelist[number]
          ) &&
          semver.major(json.version) == 0
        ) {
          report('warn', ErrorMessage.PackageJsonExperimentalVersion());
        }

        // ? Does not use outdated entry fields
        pkgJsonObsoleteEntryKeys.forEach((outdatedKey) => {
          if (json[outdatedKey]) {
            report('warn', ErrorMessage.PackageJsonObsoleteKey(outdatedKey));
          }
        });

        // ? Has maintained node version engines.node entries
        if (json.engines) {
          if (json.engines.node) {
            const expectedNodeEngines = browserslist('maintained node versions')
              .reverse()
              .map(
                (v, ndx, arr) =>
                  `${ndx == arr.length - 1 ? '>=' : '^'}${v.split(' ').at(-1)}`
              )
              .join(' || ');
            if (json.engines.node != expectedNodeEngines) {
              report('warn', ErrorMessage.PackageJsonBadEngine(expectedNodeEngines));
            }
          } else {
            report('warn', ErrorMessage.PackageJsonMissingKey('engines.node'));
          }
        }

        // ? Has no pinned or dist-tag dependencies
        [
          json.dependencies,
          json.devDependencies,
          json.peerDependencies,
          json.bundleDependencies,
          json.optionalDependencies
        ].forEach((depsObj) => {
          if (depsObj) {
            Object.entries(depsObj).forEach(([dep, semvr]) => {
              if (!Number.isNaN(parseInt(semvr[0]))) {
                report('warn', ErrorMessage.PackageJsonPinnedDependency(dep));
              } else if (!semver.valid(semvr) && !semver.validRange(semvr)) {
                report('warn', ErrorMessage.PackageJsonTaggedDependency(dep));
              }
            });
          }
        });

        // ? Has a docs entry point pointing to an existing file
        const docsEntry = (json?.config?.docs as Record<string, string>)?.entry;
        if (!docsEntry) {
          report('warn', ErrorMessage.PackageJsonMissingKey('config.docs.entry'));
        } else {
          tasks.push(
            (async () => {
              const filePath = `${root}/${docsEntry}`;
              try {
                await access(filePath);
              } catch {
                reporterFactory(filePath)(
                  'warn',
                  ErrorMessage.PackageJsonBadConfigDocsEntry()
                );
              }
            })()
          );
        }

        // ? README.md has standard well-configured topmatter and links
        const readmePath = `${root}/README.md`;
        const remark = await getRemark();
        const ast = remark.fromMarkdown(await readFile(readmePath));
        let sawBadgesStart = false;

        for (const child of ast.children) {
          if (child.type == 'html' && child.value == topmatterBadgesStart) {
            sawBadgesStart = true;
            continue;
          }
          break;
        }

        if (!sawBadgesStart) {
          reporterFactory(readmePath)('warn', ErrorMessage.MarkdownMissingTopmatter());
        }

        // ? README.md first header is the package's name if not monorepo root
        // TODO
      };

      await rootAndSubRootChecks({
        root: ctx.package?.root || ctx.project.root,
        json: ctx.package?.json || ctx.project.json,
        isCheckingMonorepoRoot: startedAtMonorepoRoot
      });

      // ? These checks are performed ONLY IF linting a monorepo root
      if (startedAtMonorepoRoot) {
        // ? Has certain tsconfig files
        tasks.push(
          checkFilesExist(
            monorepoRootTsconfigFiles,
            ctx.project.root,
            reporterFactory,
            'warn'
          )
        );

        // ? Has no "broken" packages (workspaces missing a package.json file)
        if (ctx.project.packages.broken.length) {
          ctx.project.packages.broken.forEach((pkgRoot) =>
            reporterFactory(`${pkgRoot}/package.json`)(
              'error',
              ErrorMessage.MissingFile()
            )
          );
        }

        // ? Has a "name" field
        // TODO

        // ? Has no "dependencies" field
        // TODO

        // ? Has no non-whitelisted "version" field unless next.config.js exists
        // TODO

        // ? Is "private" unless next.config.js exists
        // TODO

        // ? Recursively lint all sub-roots
        tasks.push(
          Promise.all(
            Array.from(ctx.project.packages.values())
              .concat(Array.from(ctx.project.packages.unnamed.values()))
              .map(({ root, json }) => {
                return rootAndSubRootChecks({
                  root,
                  json,
                  isCheckingMonorepoRoot: false
                });
              })
          )
        );
      }
      // ? These checks are performed ONLY IF linting a polyrepo root
      else if (!ctx.package) {
        // ? Has certain tsconfig files
        tasks.push(
          checkFilesExist(
            polyrepoTsconfigFiles,
            ctx.project.root,
            reporterFactory,
            'warn'
          )
        );
      }

      // ? These checks are performed ONLY IF linting a sub-root
      if (ctx.package) {
        const root = ctx.package.root;

        // ? Has certain tsconfig files
        tasks.push(checkFilesExist(subRootTsconfigFiles, root, reporterFactory, 'warn'));

        // ? Has no "devDependencies"
        // TODO

        // ? Has no unlisted cross-dependencies
        // TODO
      } // ? These checks are performed ONLY IF NOT linting a sub-root
      else {
        const root = ctx.project.root;

        // ? Has standard files
        // TODO

        // ? Has standard directories
        // TODO

        // ? Has release.config.js (if not "private")
        // TODO

        // ? SECURITY.md and SUPPORT.md has standard topmatter and links
        // TODO

        // ? CONTRIBUTING.md, SECURITY.md, and SUPPORT.md have well-configured
        // ? topmatter and links
        // TODO
      }
    }

    // ? Wait for checks to finish
    await Promise.all(tasks);

    return {
      success: errorCount == 0,
      output: Object.entries(outputTree).reduce<string>(
        (output, [filename, messages]) => {
          return `${output}\n\n${chalk.underline(filename)}\n  ${messages.join(
            '\n  '
          )}`.trim();
        },
        ''
      ),
      summary:
        errorCount + warnCount
          ? `${errorCount} error${errorCount != 1 ? 's' : ''}, ${warnCount} warning${
              warnCount != 1 ? 's' : ''
            }`
          : 'no issues'
    };
  } catch (e) {
    throw new Error(`project linting failed: ${e}`);
  }
}

/**
 * Performs project-wide type checking with the TypeScript `tsc` compiler.
 */
export async function runTypescriptLinter({
  rootDir,
  tsconfig
}: {
  /**
   * The project root directory containing a tsconfig.lint.json configuration
   * file.
   */
  rootDir: string;
  /**
   * An absolute or relative path to a TypeScript tsconfig.json configuration
   * file.
   */
  tsconfig: string;
}): UnifiedReturnType {
  const tscOutput = await run(
    'npx',
    ['--no-install', 'tsc', '--pretty', '--project', tsconfig],
    {
      cwd: rootDir,
      all: true
    }
  );

  const lastLine =
    tscOutput.all
      ?.trimEnd()
      .split('\n')
      .slice(-numLinesToConsider)
      .filter(ignoreEmptyAndDebugLines)
      .at(-1) || '';

  const lastLineMeta =
    /Found ((?<errors>\d+) errors?(, )?)?((?<warnings>\d+) warning)?/.exec(lastLine);

  return {
    success: tscOutput.code == 0,
    output: tscOutput.all || tscOutput.shortMessage,
    summary: summarizeOutput(tscOutput.code, lastLine, lastLineMeta)
  };
}

/**
 * Lints the contents of the specified source files using ESLint.
 */
export async function runEslintLinter({
  sourcePaths,
  rootDir,
  tsconfig
}: {
  /**
   * Absolute or relative paths that resolve to one or more directories
   * containing source files, or to one or more source files themselves.
   */
  sourcePaths: string[];
  /**
   * The project root directory 1) containing ESLint and tsconfig.lint.json
   * configuration files and 2) that relative paths and node globs are resolved
   * against.
   */
  rootDir: string;
  /**
   * An absolute or relative path to a TypeScript tsconfig.json configuration
   * file.
   */
  tsconfig: string;
}): UnifiedReturnType {
  const eslintOutput = await run(
    'npx',
    [
      '--no-install',
      'eslint',
      '--color',
      `--parser-options=project:${tsconfig}`,
      ...sourcePaths
    ],
    { cwd: rootDir, all: true }
  );

  let output = eslintOutput.all?.trimEnd() || '';

  // ? Split this into two so we can save the knowledge from this step for later
  const lastLinesWithContent = stripAnsi(output)
    .split('\n')
    .slice(-numLinesToConsider)
    .filter(ignoreEmptyAndDebugLines);

  const lastLine =
    lastLinesWithContent.filter((line) => !line.includes('--fix')).at(-1) || '';

  const lastLineMeta =
    /problems? \(((?<errors>\d+) errors?(, )?)?((?<warnings>\d+) warning)?/.exec(
      lastLine
    );

  // ? Use slice to get rid of empty newlines surrounded by ansi codes and
  // ? other undesirable lines that should not appear at the start of output
  for (
    let numLinesConsidered = 0;
    numLinesConsidered < numLinesToConsider;
    numLinesConsidered++
  ) {
    const indexOfNewLine = output.indexOf('\n');
    // ? Stop deleting on the first line that isn't empty or ignorable
    if (indexOfNewLine < 0 || ignoreEmptyAndDebugLines(output.slice(0, indexOfNewLine))) {
      break;
    } else {
      // ? DELETE!
      output = output.slice(indexOfNewLine + 1);
    }
  }

  // ? Use slice to get rid of empty newlines surrounded by ansi codes and
  // ? other undesirable lines that should not appear at the end of output
  for (
    let numLinesToRemove = -numLinesToConsider + lastLinesWithContent.length;
    output && numLinesToRemove < 0;
    numLinesToRemove++
  ) {
    // ? DELETE!
    output = output.slice(0, output.lastIndexOf('\n') + 1);
  }

  return {
    success: eslintOutput.code == 0,
    output: output || eslintOutput.shortMessage,
    summary: summarizeOutput(eslintOutput.code, lastLine, lastLineMeta)
  };
}

/**
 * Lints the contents of the specified Markdown files using Remark.
 */
export async function runRemarkLinter({
  markdownPaths,
  rootDir
}: {
  /**
   * Absolute paths, relative paths, and/or globs that resolve to one or more
   * markdown files.
   */
  markdownPaths: string[];
  /**
   * The project root directory that relative paths and node globs are resolved
   * against.
   */
  rootDir: string;
}): UnifiedReturnType {
  const remarkOutput = await run(
    'npx',
    [
      '--no-install',
      'remark',
      '--quiet',
      '--use',
      'gfm',
      '--use',
      'frontmatter',
      '--use',
      'lint-final-newline',
      '--use',
      'lint-no-auto-link-without-protocol',
      '--use',
      'lint-no-blockquote-without-marker',
      '--use',
      'lint-ordered-list-marker-style',
      '--use',
      'lint-hard-break-spaces',
      '--use',
      'lint-no-duplicate-definitions',
      '--use',
      'lint-no-heading-content-indent',
      '--use',
      'lint-no-inline-padding',
      '--use',
      'lint-no-undefined-references',
      '--use',
      'lint-no-unused-definitions',
      '--use',
      'validate-links',
      // ? We specify the paths twice here because, without more than one .md ?
      // file specified, remark will shit all over stdout for whatever reason.
      ...markdownPaths,
      ...markdownPaths
    ],
    { cwd: rootDir, all: true }
  );

  const lastLine =
    stripAnsi(remarkOutput.all?.trimEnd() || '')
      .split('\n')
      .slice(-numLinesToConsider)
      .filter(ignoreEmptyAndDebugLines)
      .at(-1) || '';

  const lastLineMeta =
    /(?:(?<errors1>\d+) errors?, .*?(?<warnings1>\d+) warning)|(?:(?<errors2>\d+) errors?)|(?:(?<warnings2>\d+) warning)/.exec(
      lastLine
    );

  return {
    success: remarkOutput.code == 0,
    output: remarkOutput.all || remarkOutput.shortMessage,
    summary: summarizeOutput(remarkOutput.code, lastLine, {
      groups: {
        errors: lastLineMeta?.groups?.errors1 || lastLineMeta?.groups?.errors2,
        warnings: lastLineMeta?.groups?.warnings1 || lastLineMeta?.groups?.warnings2
      }
    } as unknown as RegExpExecArray)
  };
}
