import { XPackageJsonNotParsableError } from 'universe+fs:error.ts';
import { readJson } from 'universe+fs:system/read-json.ts';

import type { AbsolutePath } from '@-xun/fs';
import type { XPackageJson } from '@-xun/project-types';
import type { Promisable } from 'type-fest';
import type { ParametersNoFirst, SyncVersionOf } from 'multiverse+common:types.ts';

/**
 * @see {@link readXPackageJsonAtRoot}
 */
export type ReadXPackageJsonAtRootOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * The caching behavior of this function is identical to that of
   * {@link readJson}.
   */
  useCached: boolean;
  /**
   * If `true`, an attempt will be made to read in and parse the JSON file. If
   * it fails (i.e. an error is thrown), `{}` is returned and no error is
   * thrown.
   *
   * Note that, currently, fail results (where `{}` is returned) are not cached.
   *
   * @default false
   */
  try?: boolean;
};

function readXPackageJsonAtRoot_(
  shouldRunSynchronously: false,
  packageRoot: AbsolutePath,
  options: ReadXPackageJsonAtRootOptions & { try: true }
): Promise<XPackageJson | undefined>;
function readXPackageJsonAtRoot_(
  shouldRunSynchronously: true,
  packageRoot: AbsolutePath,
  options: ReadXPackageJsonAtRootOptions & { try: true }
): XPackageJson | undefined;
function readXPackageJsonAtRoot_(
  shouldRunSynchronously: false,
  packageRoot: AbsolutePath,
  options: ReadXPackageJsonAtRootOptions
): Promise<XPackageJson>;
function readXPackageJsonAtRoot_(
  shouldRunSynchronously: true,
  packageRoot: AbsolutePath,
  options: ReadXPackageJsonAtRootOptions
): XPackageJson;
function readXPackageJsonAtRoot_(
  shouldRunSynchronously: boolean,
  packageRoot: AbsolutePath,
  { useCached, try: try_ }: ReadXPackageJsonAtRootOptions
): Promisable<XPackageJson | undefined> {
  // ? readJson will check if the path is absolute for us
  const packageJsonPath = `${packageRoot}/package.json` as AbsolutePath;

  try {
    return (shouldRunSynchronously ? readJson.sync : readJson)(packageJsonPath, {
      useCached,
      try: try_
    }) as ReturnType<typeof readXPackageJsonAtRoot_>;
  } catch (error) {
    throw new XPackageJsonNotParsableError(packageJsonPath, error);
  }
}

/**
 * Asynchronously read in and parse the contents of a package.json file.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with `cache.clear`.
 *
 * @see {@link readJson} (the function that actually does the reading/caching)
 */
export function readXPackageJsonAtRoot(
  ...args: ParametersNoFirst<typeof readXPackageJsonAtRoot_>
) {
  return readXPackageJsonAtRoot_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace readXPackageJsonAtRoot {
  /**
   * Synchronously read in and parse the contents of a package.json file.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * `cache.clear`.
   *
   * @see {@link readJson} (the function that actually does the reading/caching)
   */
  export const sync = function (...args) {
    return readXPackageJsonAtRoot_(true, ...args);
  } as SyncVersionOf<typeof readXPackageJsonAtRoot>;
}
