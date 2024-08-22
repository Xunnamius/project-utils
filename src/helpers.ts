import { isAbsolute } from 'node:path';
import semver from 'semver';
import browserslist from 'browserslist';

import { PathIsNotAbsoluteError } from 'pkgverse/core/src/errors';

/**
 * Throws if the provided path is not absolute.
 */
export function ensurePathIsAbsolute({ path }: { path: string }) {
  if (!isAbsolute(path)) {
    throw new PathIsNotAbsoluteError(path);
  }
}

/**
 * Returns the expected value for `package.json` `node.engines` field
 */
export function getMaintainedNodeVersions(options?: {
  /**
   * This determines in what format the results are returned. `"engines"`
   * returns the currently maintained node versions as a string suitable for the
   * `engines` key in a `package.json` file. `array` returns an array of the
   * currently maintained node versions.
   *
   * @default engines
   */
  format?: 'engines';
}): string;
/**
 * Returns the expected value for `package.json` `node.engines` field
 */
export function getMaintainedNodeVersions(options?: {
  /**
   * This determines in what format the results are returned. `"engines"`
   * returns the currently maintained node versions as a string suitable for the
   * `engines` key in a `package.json` file. `array` returns an array of the
   * currently maintained node versions.
   *
   * @default engines
   */
  format?: 'array';
}): string[];
export function getMaintainedNodeVersions(options?: {
  /**
   * This determines in what format the results are returned. `"engines"`
   * returns the currently maintained node versions as a string suitable for the
   * `engines` key in a `package.json` file. `array` returns an array of the
   * currently maintained node versions.
   *
   * @default engines
   */
  format?: 'engines' | 'array';
}): string | string[] {
  const versions = browserslist('maintained node versions')
    .map((v) => v.split(' ').at(-1) as string)
    .sort(semver.compareBuild);

  return options?.format == 'array'
    ? versions
    : versions
        .map((value, index, array) => `${index == array.length - 1 ? '>=' : '^'}${value}`)
        .join(' || ');
}
