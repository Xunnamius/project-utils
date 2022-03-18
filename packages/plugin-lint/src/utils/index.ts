import { ErrorMessage } from '../errors';
import { access } from 'fs/promises';
import semver from 'semver';
import browserslist from 'browserslist';
import stripAnsi from 'strip-ansi';

import type { PackageJson } from 'type-fest';

export type ExportsPaths = {
  filesystemPaths: (string | null | undefined)[];
  exportsObjectPath: string[];
  isImplicitDefault: boolean;
};

export type ReporterFactory = (
  currentFile: string
) => (type: ReportType, message: string) => void;

export type ReportType = 'warn' | 'error';

export * from './mdast';
export * from './babel';

/**
 * Filters out empty and debug lines from linter output.
 *
 * Until something is done about https://github.com/nodejs/node/issues/34799, we
 * unfortunately have to remove the annoying debugging lines manually...
 */
export function ignoreEmptyAndDebugLines(line: string) {
  return (
    stripAnsi(line) &&
    line != 'Debugger attached.' &&
    line != 'Waiting for the debugger to disconnect...'
  );
}

/**
 * Accepts the `summaryLine` of linter output and the result of `RegExp.exec`
 * (`metaSummaryLine`), where the `errors` and `warning` capture groups have
 * been defined, and returns a normalized summary of the number of errors and
 * warnings that occurred.
 */
export function summarizeLinterOutput(
  exitCode: number,
  summaryLine: string,
  summaryLineMeta: ReturnType<RegExp['exec']>
) {
  const errors = parseInt(summaryLineMeta?.groups?.errors || '0');
  const warnings = parseInt(summaryLineMeta?.groups?.warnings || '0');

  return !summaryLine
    ? exitCode == 0
      ? 'no issues'
      : 'unknown issue'
    : errors + warnings
    ? `${errors} error${errors != 1 ? 's' : ''}, ${warnings} warning${
        warnings != 1 ? 's' : ''
      }`
    : '1 error, 0 warnings';
}

/**
 * Flatten the package.json `"exports"` field into an array of entry points.
 */
export function deepFlattenPkgExports(
  pkgExports: PackageJson['exports'],
  exportsObjectPath: string[] = []
): ExportsPaths[] {
  const partial = { exportsObjectPath, isImplicitDefault: !exportsObjectPath.length };
  return !pkgExports || typeof pkgExports == 'string'
    ? [{ filesystemPaths: [pkgExports], ...partial }]
    : Array.isArray(pkgExports)
    ? [{ filesystemPaths: pkgExports, ...partial }]
    : Object.entries(pkgExports).flatMap(([k, v]) =>
        deepFlattenPkgExports(v, [...exportsObjectPath, k])
      );
}

/**
 * Check if a list of `paths` (relative to `root`) exist.
 */
export function checkPathsExist(
  paths: readonly string[],
  root: string,
  reporterFactory: ReporterFactory,
  type: ReportType = 'error',
  errorMessage: 'MissingFile' | 'MissingDirectory' = 'MissingFile'
) {
  return Promise.all(
    paths.map(async (file) => {
      const filePath = `${root}/${file}`;
      try {
        await access(filePath);
      } catch {
        reporterFactory(filePath)(type, ErrorMessage[errorMessage]());
      }
    })
  );
}

/**
 * Returns the expected value for `package.json` `node.engines` field
 */
export function getExpectedPkgNodeEngines() {
  return browserslist('maintained node versions')
    .map((v) => v.split(' ').at(-1) as string)
    .sort(semver.compareBuild)
    .map((v, ndx, arr) => `${ndx == arr.length - 1 ? '>=' : '^'}${v}`)
    .join(' || ');
}
