import { run } from 'multiverse/run';
import { ErrorMessage } from './errors';
import stripAnsi from 'strip-ansi';
import chalk from 'chalk';
import { getRunContext } from '@projector-js/core/project-utils';

import {
  PackageJsonNotFoundError,
  BadPackageJsonError,
  NotAGitRepositoryError,
  DuplicatePackageIdError,
  DuplicatePackageNameError
} from '@projector-js/core/errors';

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
    line &&
    line != 'Debugger attached.' &&
    line != 'Waiting for the debugger to disconnect...'
  );
};

/**
 * Accepts the `lastLine` of linter output and the result of `RegExp.exec` where
 * the `errors` and `warning` capture groups have been defined and returns a
 * normalized summary of the number of errors and warnings that occurred.
 */
const summarizeOutput = (lastLine: string, lastLineMeta: ReturnType<RegExp['exec']>) => {
  const errors = parseInt(lastLineMeta?.groups?.errors || '0');
  const warnings = parseInt(lastLineMeta?.groups?.warnings || '0');

  return !lastLine
    ? 'no issues'
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
    let currentFile = `${rootDir}/package.json`;

    const report = (type: 'warn' | 'error', message: string) => {
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
        return getRunContext({ cwd: rootDir });
      } catch (e) {
        if (e instanceof PackageJsonNotFoundError) {
          report('error', ErrorMessage.MissingFile(currentFile));
        } else if (e instanceof BadPackageJsonError) {
          currentFile = e.packageJsonPath;
          report('error', ErrorMessage.PackageJsonUnparsable(currentFile));
        } else if (e instanceof NotAGitRepositoryError) {
          report('error', ErrorMessage.NotAGitRepository());
        } else if (e instanceof DuplicatePackageIdError) {
          report('error', e.message[0].toUpperCase() + e.message.slice(1));
        } else if (e instanceof DuplicatePackageNameError) {
          report('error', e.message[0].toUpperCase() + e.message.slice(1));
        } else {
          throw e;
        }

        return undefined;
      }
    })();

    // ? These checks are performed across all contexts TODO: use browserslist
    // to get earliest "maintained node versions" and TODO: convert this into an
    // or (||) list, e.g.: TODO: ^12.20.0 || ^14.13.1 || >=16.0.0 TODO: (project
    // root and each package root)

    // TODO: checks should be async

    if (ctx !== undefined) {
      // ? These checks are performed UNLESS linting a sub-root
      if (ctx.context == 'polyrepo' || ctx.package) {
      }

      if (ctx.context == 'monorepo') {
        // ? These checks are performed ONLY IF linting a monorepo root
        if (!ctx.package) {
        }
        // ? These checks are performed ONLY IF linting a sub-root
        else {
        }
      }
    }

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
      // ? Speedup: only consider the last 5 lines
      .slice(-5)
      .filter(ignoreEmptyAndDebugLines)
      .at(-1) || '';

  const lastLineMeta =
    /Found ((?<errors>\d+) errors?(, )?)?((?<warnings>\d+) warning)?/.exec(lastLine);

  return {
    success: tscOutput.code == 0,
    output: tscOutput.all,
    summary: summarizeOutput(lastLine, lastLineMeta)
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

  const lastLine =
    stripAnsi(eslintOutput.all?.trimEnd() || '')
      .split('\n')
      // ? Speedup: only consider the last 5 lines
      .slice(-5)
      .filter((line) => ignoreEmptyAndDebugLines(line) && !line.includes('--fix'))
      .at(-1) || '';

  const lastLineMeta =
    /problems? \(((?<errors>\d+) errors?(, )?)?((?<warnings>\d+) warning)?/.exec(
      lastLine
    );

  return {
    success: eslintOutput.code == 0,
    output: eslintOutput.all,
    summary: summarizeOutput(lastLine, lastLineMeta)
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
      // ? Speedup: only consider the last 5 lines
      .slice(-5)
      .filter(ignoreEmptyAndDebugLines)
      .at(-1) || '';

  const lastLineMeta =
    /(?:(?<errors1>\d+) errors?, .*?(?<warnings1>\d+) warning)|(?:(?<errors2>\d+) errors?)|(?:(?<warnings2>\d+) warning)/.exec(
      lastLine
    );

  return {
    success: remarkOutput.code == 0,
    output: remarkOutput.all,
    summary: summarizeOutput(lastLine, {
      groups: {
        errors: lastLineMeta?.groups?.errors1 || lastLineMeta?.groups?.errors2,
        warnings: lastLineMeta?.groups?.warnings1 || lastLineMeta?.groups?.warnings2
      }
    } as unknown as RegExpExecArray)
  };
}
