import { run } from 'multiverse/run';
import { readFile } from 'fs/promises';
import stripAnsi from 'strip-ansi';

import type { PackageJson } from 'type-fest';

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
   * The project or package root directory. Must contain a package.json file.
   */
  rootDir: string;
  /**
   * If additional monorepo-specific checks should be performed.
   */
  monorepo: boolean;
}): UnifiedReturnType {
  try {
    const packageJson: PackageJson = JSON.parse(
      await readFile(`${rootDir}/package.json`, 'utf-8')
    );

    // TODO
    void packageJson;

    return {
      success: false,
      output: undefined,
      summary: 'x errors, y warnings' || 'no issues'
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

  const lastLine = tscOutput.all?.trimEnd().split('\n').slice(-1)[0];

  return {
    success: tscOutput.code == 0,
    output: tscOutput.all,
    summary: !lastLine
      ? 'no issues'
      : lastLine?.startsWith('Found')
      ? lastLine.slice(6, -1).trim()
      : '1 error'
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

  return {
    success: eslintOutput.code == 0,
    output: eslintOutput.all,
    summary:
      stripAnsi(eslintOutput.all?.trimEnd() || '')
        .split('\n')
        .filter(Boolean)
        .slice(-1)[0]
        ?.split('(')
        .slice(-1)[0]
        ?.slice(0, -1)
        .trim() || 'no issues'
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
      // ? We specify the paths twice here because, without more than one .md
      // ? file specified, remark will shit all over stdout for whatever reason.
      ...markdownPaths,
      ...markdownPaths
    ],
    { cwd: rootDir, all: true }
  );

  return {
    success: remarkOutput.code == 0,
    output: remarkOutput.all,
    summary:
      stripAnsi(remarkOutput.all?.trimEnd() || '')
        .split('\n')
        .slice(-1)[0]
        ?.replace(/[^a-zA-Z0-9\s]/g, '')
        .trim() || 'no issues'
  };
}
