import { run } from 'multiverse/run';
import { ErrorMessage } from './errors';
import { getRunContext } from 'pkgverse/core/src/project-utils';
import { access } from 'fs/promises';
import { glob } from 'glob';
import { promisify } from 'util';
import stripAnsi from 'strip-ansi';
import chalk from 'chalk';

import {
  PackageJsonNotFoundError,
  BadPackageJsonError,
  NotAGitRepositoryError,
  DuplicatePackageIdError,
  DuplicatePackageNameError
} from 'pkgverse/core/src/errors';

import type { PackageJson } from 'type-fest';

// ? Speedup: only consider the last 5 lines
const numLinesToConsider = 5;

// ? Files that must exist in all roots and sub-roots (relative paths)
export const requiredFiles = ['LICENSE', 'README.md'] as const;

// ? Required fields in all roots and sub-roots
export const globalPkgJsonRequiredFields = [
  'homepage',
  'repository',
  'license',
  'author',
  'engines',
  'type'
] as const;

// ? Additionally required fields in monorepo sub-roots and polyrepo roots
export const nonMonoRootPkgJsonRequiredFields = ['description'] as const;

// ? Additionally required fields in monorepo sub-roots and polyrepo roots when
// ? "private" != `true`
export const publicPkgJsonRequiredFields = [
  'name',
  'version',
  'keywords',
  'sideEffects',
  'exports',
  'typesVersions',
  'files',
  'publishConfig'
] as const;

// ? Required "files" field values (absolute paths)
export const pkgJsonRequiredFiles = [
  '/dist',
  '/LICENSE',
  '/package.json',
  '/README.md'
] as const;

// ? Required "exports" field keys
export const pkgJsonRequiredExports = ['./package', './package.json'] as const;

const globAsync = promisify(glob);

type UnifiedReturnType = Promise<{
  success: boolean;
  output: string | undefined;
  summary: string;
}>;

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

    const reporterFactory =
      (currentFile: string) => (type: 'warn' | 'error', message: string) => {
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

    // ? Checks are performed in "parallel"
    const tasks: Promise<unknown>[] = [];

    // ? These checks are performed across all contexts
    if (ctx !== undefined) {
      const startedAtMonorepoRoot = ctx.context == 'monorepo' && !ctx.package;

      const rootAndSubRootChecks = ({
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

          // ? package.json must also have required fields (if not private)
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
        if (json.exports) {
          const xports =
            typeof json.exports == 'string' || Array.isArray(json.exports)
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

        // ? Has requiredFiles
        tasks.push(
          Promise.all(
            requiredFiles.map(async (file) => {
              const filePath = `${root}/${file}`;
              try {
                await access(filePath);
              } catch {
                reporterFactory(filePath)('error', ErrorMessage.MissingFile());
              }
            })
          )
        );
      };

      // TODO: use browserslist to get earliest "maintained node versions" and
      // TODO: convert this into an or (||) list, e.g.:
      // TODO: ^12.20.0 || ^14.13.1 || >=16.0.0
      // TODO: (project root and each package root)

      // TODO: run/filesystem checks should be async

      // TODO: use debug

      rootAndSubRootChecks({
        root: ctx.package?.root || ctx.project.root,
        json: ctx.package?.json || ctx.project.json,
        isCheckingMonorepoRoot: startedAtMonorepoRoot
      });

      // ? These checks are performed ONLY IF linting a monorepo root
      if (startedAtMonorepoRoot) {
        if (ctx.project.packages.broken.length) {
          ctx.project.packages.broken.forEach((pkgRoot) =>
            reporterFactory(`${pkgRoot}/package.json`)(
              'error',
              ErrorMessage.MissingFile()
            )
          );
        }

        Array.from(ctx.project.packages.values())
          .concat(Array.from(ctx.project.packages.unnamed.values()))
          .forEach(({ root, json }) => {
            rootAndSubRootChecks({ root, json, isCheckingMonorepoRoot: false });
          });
      }

      // ? These checks are performed ONLY IF linting a sub-root
      if (ctx.package) {
      } // ? These checks are performed ONLY IF NOT linting a sub-root
      else {
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
