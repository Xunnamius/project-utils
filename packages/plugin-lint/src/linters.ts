import { run } from 'multiverse/run';
import { CliError, ErrorMessage } from './errors';
import { getRunContext } from 'pkgverse/core/src/project-utils';
import { access } from 'fs/promises';
import { glob } from 'glob';
import { promisify } from 'util';
import { toss } from 'toss-expression';
import semver from 'semver';
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
  repoRootRequiredFiles,
  repoRootRequiredDirectories,
  requiredFiles,
  subRootTsconfigFiles,
  markdownSecurityStandardLinks,
  markdownSupportStandardLinks,
  markdownContributingStandardLinks,
  markdownSupportStandardTopmatter,
  markdownSecurityStandardTopmatter
} from './constants';

import {
  checkPathsExist,
  deepFlattenPkgExports,
  getExpectedPkgNodeEngines,
  ignoreEmptyAndDebugLines,
  summarizeLinterOutput,
  checkReadmeFile,
  checkStandardMdFile,
  checkCrossDependencies
} from './utils';

import type { ReporterFactory } from './utils';
import type { PackageJson } from 'type-fest';

const globAsync = promisify(glob);

type UnifiedReturnType = Promise<{
  success: boolean;
  output: string | undefined;
  summary: string;
}>;

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
        isCheckingMonorepoRoot,
        isCheckingMonorepoSubRoot
      }: {
        root: string;
        json: PackageJson;
        isCheckingMonorepoRoot: boolean;
        isCheckingMonorepoSubRoot: boolean;
      }) => {
        const reportPkg = reporterFactory(`${root}/package.json`);

        // ? package.json must have required fields
        globalPkgJsonRequiredFields.forEach((field) => {
          if (json[field] === undefined) {
            reportPkg('error', ErrorMessage.PackageJsonMissingKey(field));
          }
        });

        // ? package.json must have required fields (if not a monorepo root)
        if (!isCheckingMonorepoRoot) {
          nonMonoRootPkgJsonRequiredFields.forEach((field) => {
            if (json[field] === undefined) {
              reportPkg('error', ErrorMessage.PackageJsonMissingKey(field));
            }
          });

          // ? package.json must also have required fields (if not private)
          if (!json.private) {
            publicPkgJsonRequiredFields.forEach((field) => {
              if (json[field] === undefined) {
                reportPkg('error', ErrorMessage.PackageJsonMissingKey(field));
              }
            });
          }
        }

        // ? package.json has duplicate dependencies
        if (json.dependencies && json.devDependencies) {
          const devDeps = Object.keys(json.devDependencies);
          Object.keys(json.dependencies)
            .filter((d) => devDeps.includes(d))
            .forEach((dep) => {
              reportPkg('error', ErrorMessage.PackageJsonDuplicateDependency(dep));
            });
        }

        // ? package.json has baseline distributable contents whitelist
        if (json.files) {
          pkgJsonRequiredFiles.forEach((file) => {
            if (!json.files?.includes(file)) {
              reportPkg('error', ErrorMessage.PackageJsonMissingValue('files', file));
            }
          });
        }

        // ? package.json has standard entry points
        if (json.exports !== undefined) {
          const xports =
            !json.exports ||
            typeof json.exports == 'string' ||
            Array.isArray(json.exports)
              ? {}
              : json.exports;

          const entryPoints = Object.keys(xports);
          const distPaths = deepFlattenPkgExports(xports);

          pkgJsonRequiredExports.forEach((requiredEntryPoint) => {
            if (!entryPoints.includes(requiredEntryPoint)) {
              reportPkg(
                'error',
                ErrorMessage.PackageJsonMissingEntryPoint(requiredEntryPoint)
              );
            }
          });

          // ? All package.json entry points either exist or are private (null)
          distPaths.forEach(({ filesystemPaths, exportsObjectPath }) => {
            tasks.push(
              (async () => {
                const results = await Promise.all(
                  filesystemPaths.map((path) => {
                    if (path === null) return true;
                    if (path === undefined) return false;
                    return globAsync(path, {
                      cwd: root,
                      ignore: ['**/node_modules/**']
                    }).then((files) => !!files.length);
                  })
                );

                if (!results.some(Boolean)) {
                  reportPkg(
                    'error',
                    ErrorMessage.PackageJsonBadEntryPoint(exportsObjectPath)
                  );
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
                    reportPkg(
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
        tasks.push(checkPathsExist(requiredFiles, root, reporterFactory, 'error'));

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
          reportPkg(
            'warn',
            ErrorMessage.PackageJsonMissingValue('license', pkgJsonLicense)
          );
        }

        // ? Has non-experimental non-whitelisted version
        if (!isCheckingMonorepoRoot && json.version && semver.major(json.version) == 0) {
          reportPkg('warn', ErrorMessage.PackageJsonExperimentalVersion());
        }

        // ? Does not use outdated entry fields
        pkgJsonObsoleteEntryKeys.forEach((outdatedKey) => {
          if (json[outdatedKey]) {
            reportPkg('warn', ErrorMessage.PackageJsonObsoleteKey(outdatedKey));
          }
        });

        // ? Has maintained node version engines.node entries
        if (json.engines) {
          if (json.engines.node) {
            const expectedNodeEngines = getExpectedPkgNodeEngines();
            if (json.engines.node != expectedNodeEngines) {
              reportPkg('warn', ErrorMessage.PackageJsonBadEngine(expectedNodeEngines));
            }
          } else {
            reportPkg('warn', ErrorMessage.PackageJsonMissingKey('engines.node'));
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
                reportPkg('warn', ErrorMessage.PackageJsonPinnedDependency(dep));
              } else if (
                !semver.valid(semvr) &&
                !semver.validRange(semvr) &&
                !semvr.startsWith('https://xunn.at')
              ) {
                reportPkg('warn', ErrorMessage.PackageJsonNonSemverDependency(dep));
              }
            });
          }
        });

        // ? Has a docs entry point pointing to an existing file (if not a
        // ? monorepo root)
        if (!isCheckingMonorepoRoot) {
          const docsEntry = (json?.config?.docs as Record<string, string>)?.entry;
          if (!docsEntry) {
            reportPkg('warn', ErrorMessage.PackageJsonMissingKey('config.docs.entry'));
          } else {
            tasks.push(
              (async () => {
                const doesExist = await globAsync(docsEntry, {
                  cwd: root,
                  ignore: ['**/node_modules/**']
                }).then((files) => !!files.length);
                if (!doesExist) {
                  reportPkg('warn', ErrorMessage.PackageJsonBadConfigDocsEntry());
                }
              })()
            );
          }
        }

        // ? README.md has standard well-configured topmatter and links
        tasks.push(
          checkReadmeFile({
            readmePath: `${root}/README.md`,
            pkgJson: json,
            reporterFactory,
            condition: isCheckingMonorepoRoot
              ? 'monorepo'
              : isCheckingMonorepoSubRoot
              ? 'subroot'
              : 'polyrepo'
          })
        );

        // ? These checks are performed ONLY IF linting a sub-root
        if (isCheckingMonorepoSubRoot) {
          // ? Has certain tsconfig files
          tasks.push(
            checkPathsExist(subRootTsconfigFiles, root, reporterFactory, 'warn')
          );

          // ? Has codecov flag config
          if (!(json.config?.codecov as Record<string, string>)?.flag) {
            reportPkg('warn', ErrorMessage.PackageJsonMissingKey('config.codecov.flag'));
          }

          // ? Has no "devDependencies"
          if (ctx.project.json.devDependencies) {
            reportPkg('warn', ErrorMessage.PackageJsonIllegalKey('devDependencies'));
          }

          // ? Has no unlisted cross-dependencies
          tasks.push(checkCrossDependencies({ pkgJson: json, reporterFactory }));
        }
      };

      await rootAndSubRootChecks({
        root: ctx.package?.root || ctx.project.root,
        json: ctx.package?.json || ctx.project.json,
        isCheckingMonorepoRoot: startedAtMonorepoRoot,
        isCheckingMonorepoSubRoot: !!ctx.package
      });

      // ? These additional checks are performed ONLY IF linting a monorepo root
      if (startedAtMonorepoRoot) {
        // ? Has certain tsconfig files
        tasks.push(
          checkPathsExist(
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

        const reportPkg = reporterFactory(`${ctx.project.root}/package.json`);
        const isNextJsProject = await (async () => {
          try {
            await access(`${ctx.project.root}/next.config.js`);
            return true;
          } catch {}
          return false;
        })();

        // ? Has a "name" field (the case where !private is already covered)
        if (ctx.project.json.private && !ctx.project.json.name) {
          reportPkg('warn', ErrorMessage.PackageJsonMissingKey('name'));
        }

        // ? Is private
        if (ctx.project.json.private === undefined) {
          reportPkg('warn', ErrorMessage.PackageJsonMissingKey('private'));
        } else if (ctx.project.json.private !== true) {
          reportPkg('warn', ErrorMessage.PackageJsonMissingValue('private', 'true'));
        }

        // ? ... unless next.config.js exists
        if (!isNextJsProject) {
          // ? Has no "dependencies" field
          if (ctx.project.json.dependencies) {
            reportPkg('warn', ErrorMessage.PackageJsonIllegalKey('dependencies'));
          }

          // ? Has no non-whitelisted "version" field
          if (
            ctx.project.json.version &&
            !pkgVersionWhitelist.includes(
              ctx.project.json.version as typeof pkgVersionWhitelist[number]
            )
          ) {
            reportPkg('warn', ErrorMessage.PackageJsonIllegalKey('version'));
          }
        }

        // ? Recursively lint all sub-roots
        tasks.push(
          Promise.all(
            Array.from(ctx.project.packages.values())
              .concat(Array.from(ctx.project.packages.unnamed.values()))
              .map(({ root, json }) => {
                return rootAndSubRootChecks({
                  root,
                  json,
                  isCheckingMonorepoRoot: false,
                  isCheckingMonorepoSubRoot: true
                });
              })
          )
        );
      }
      // ? These additional checks are performed ONLY IF linting a polyrepo root
      else if (!ctx.package) {
        // ? Has certain tsconfig files
        tasks.push(
          checkPathsExist(
            polyrepoTsconfigFiles,
            ctx.project.root,
            reporterFactory,
            'warn'
          )
        );
      }

      // ? These additional checks are performed ONLY IF NOT linting a sub-root
      if (!ctx.package) {
        const root = ctx.project.root;

        // ? Has required files
        tasks.push(checkPathsExist(repoRootRequiredFiles, root, reporterFactory, 'warn'));

        // ? Has standard directories
        tasks.push(
          checkPathsExist(
            repoRootRequiredDirectories,
            root,
            reporterFactory,
            'warn',
            'MissingDirectory'
          )
        );

        // ? Has release.config.js if not private
        if (!ctx.project.json.private) {
          tasks.push(
            checkPathsExist(['release.config.js'], root, reporterFactory, 'warn')
          );
        }

        // ? SECURITY.md has standard well-configured topmatter and links and is
        // ? consistent with blueprints
        tasks.push(
          checkStandardMdFile({
            mdPath: `${root}/SECURITY.md`,
            pkgJson: ctx.project.json,
            standardTopmatter: markdownSecurityStandardTopmatter,
            standardLinks: markdownSecurityStandardLinks,
            reporterFactory
          })
        );

        // ? SUPPORT.md has standard well-configured topmatter and links and is
        // ? consistent with blueprints
        tasks.push(
          checkStandardMdFile({
            mdPath: `${root}/.github/SUPPORT.md`,
            pkgJson: ctx.project.json,
            standardTopmatter: markdownSupportStandardTopmatter,
            standardLinks: markdownSupportStandardLinks,
            reporterFactory
          })
        );

        // ? CONTRIBUTING.md has standard well-configured topmatter and links
        // ? and is consistent with blueprints
        tasks.push(
          checkStandardMdFile({
            mdPath: `${root}/CONTRIBUTING.md`,
            pkgJson: ctx.project.json,
            standardTopmatter: null,
            standardLinks: markdownContributingStandardLinks,
            reporterFactory
          })
        );
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
    throw new Error(`project linting failed: ${e}`, { cause: e as Error });
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
    summary: summarizeLinterOutput(tscOutput.code, lastLine, lastLineMeta)
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
    summary: summarizeLinterOutput(eslintOutput.code, lastLine, lastLineMeta)
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
    summary: summarizeLinterOutput(remarkOutput.code, lastLine, {
      groups: {
        errors: lastLineMeta?.groups?.errors1 || lastLineMeta?.groups?.errors2,
        warnings: lastLineMeta?.groups?.warnings1 || lastLineMeta?.groups?.warnings2
      }
    } as unknown as RegExpExecArray)
  };
}
