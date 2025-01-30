import semver from 'semver';

import type { Arrayable } from 'type-fest';

/**
 * Synchronously returns the expected value for `package.json`
 * `engines`/`engines.node` field.
 */
export function generatePackageJsonEngineMaintainedNodeVersions(options?: {
  /**
   * This determines in what format the results are returned. `"engines"`
   * returns the currently maintained node versions as a string suitable for the
   * `engines`/`engines.node` key in a `package.json` file. `array` returns an
   * array of the currently maintained node versions.
   *
   * @default engines
   */
  format?: 'engines';
}): string;
/**
 * Synchronously returns an array of the currently maintained node versions.
 */
export function generatePackageJsonEngineMaintainedNodeVersions(options?: {
  /**
   * This determines in what format the results are returned. `"engines"`
   * returns the currently maintained node versions as a string suitable for the
   * `engines`/`engines.node` key in a `package.json` file. `array` returns an
   * array of the currently maintained node versions.
   *
   * @default engines
   */
  format: 'array';
}): string[];
/**
 * Synchronously returns maintained node versions in the given format.
 */
export function generatePackageJsonEngineMaintainedNodeVersions(options?: {
  format?: 'engines' | 'array';
}): Arrayable<string>;
export function generatePackageJsonEngineMaintainedNodeVersions(options?: {
  format?: 'engines' | 'array';
}): Arrayable<string> {
  // ? We do this to make testing this easier in the presence of babel which
  // ? does not like it when browserslist is mocked
  const versions = (require('browserslist')('maintained node versions') as string[])
    .map((v) => v.split(' ').at(-1)!)
    .sort(semver.compareBuild);

  return options?.format === 'array'
    ? versions
    : versions
        .map((value, index, array) => {
          return `${index === array.length - 1 ? '>=' : '^'}${value}`;
        })
        .join(' || ');
}
