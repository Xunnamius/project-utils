import { isXPackageJson } from '@-xun/project-types';

import { commonDebug } from 'universe+fs:common.ts';

import {
  FsErrorMessage,
  ProjectError,
  XPackageJsonNotParsableError
} from 'universe+fs:error.ts';

import { readJson } from 'universe+fs:system/read-json.ts';

import type { AbsolutePath } from '@-xun/fs';
import type { XPackageJson } from '@-xun/project-types';
import type { EmptyObject, Promisable } from 'type-fest';
import type { ParametersNoFirst, SyncVersionOf } from 'multiverse+common:types.ts';

const debug = commonDebug.extend('readXPackageJsonAtRoot');

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
  options: ReadXPackageJsonAtRootOptions
): Promise<XPackageJson | EmptyObject>;
function readXPackageJsonAtRoot_(
  shouldRunSynchronously: true,
  packageRoot: AbsolutePath,
  options: ReadXPackageJsonAtRootOptions
): XPackageJson | EmptyObject;
function readXPackageJsonAtRoot_(
  shouldRunSynchronously: boolean,
  packageRoot: AbsolutePath,
  { useCached, try: try_ }: ReadXPackageJsonAtRootOptions
): Promisable<XPackageJson | EmptyObject> {
  // ? readJson will check if the path is absolute for us
  const packageJsonPath = `${packageRoot}/package.json` as AbsolutePath;

  if (shouldRunSynchronously) {
    try {
      return handleResult(
        readJson.sync(packageJsonPath, {
          useCached,
          try: try_
        })
      );
    } catch (error) {
      return handleError(error);
    }
  } else {
    return readJson(packageJsonPath, {
      useCached,
      try: try_
    })
      .then(handleResult)
      .catch(handleError);
  }

  function handleResult(result: unknown) {
    if (isXPackageJson(result)) {
      return result;
    }

    throw new ProjectError(FsErrorMessage.IsNotXPackageJson());
  }

  function handleError(error: unknown): EmptyObject | never {
    if (try_) {
      debug.warn(
        'attempt to parse file contents as XPackageJson failed (this error will be ignored): %O',
        error
      );

      return {};
    }

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
  path: AbsolutePath,
  options: ReadXPackageJsonAtRootOptions & { try?: false }
): Promise<XPackageJson>;
export function readXPackageJsonAtRoot(
  path: AbsolutePath,
  options: ReadXPackageJsonAtRootOptions
): Promise<XPackageJson | EmptyObject>;
export function readXPackageJsonAtRoot(
  ...args: ParametersNoFirst<typeof readXPackageJsonAtRoot_>
  // ? Could avoid "any" by further overloading readXPackageJsonAtRoot_, but meh
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
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
  function readXPackageJsonAtRootSync(
    path: AbsolutePath,
    options: ReadXPackageJsonAtRootOptions & { try?: false }
  ): XPackageJson;
  function readXPackageJsonAtRootSync(
    path: AbsolutePath,
    options: ReadXPackageJsonAtRootOptions
  ): XPackageJson | EmptyObject;
  function readXPackageJsonAtRootSync(
    ...args: Parameters<SyncVersionOf<typeof readXPackageJsonAtRoot>>
  ) {
    return readXPackageJsonAtRoot_(true, ...args);
  }

  export const sync = readXPackageJsonAtRootSync;
}
