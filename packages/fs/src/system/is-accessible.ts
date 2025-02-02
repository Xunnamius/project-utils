import { accessSync } from 'node:fs';
import { access as accessAsync, constants as fsConstants_ } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { memoizer } from '@-xun/memoize';

import type { Promisable } from 'type-fest';
import type { ParametersNoFirst, SyncVersionOf } from 'multiverse+common:types.ts';

/**
 * @see {@link fsConstants_}
 */
export const fsConstants = fsConstants_;

/**
 * @see {@link isAccessible}
 */
export type IsAccessibleOptions = {
  /**
   * The type of access check to perform. Defaults to `fs.constants.R_OK`.
   *
   * @see {@link fs.constants}
   */
  fsConstant?: number;
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * Unless `useCached` is `false`, the results returned by this function will
   * always strictly equal (`===`) each other with respect to call signature.
   *
   * @see {@link cache}
   */
  useCached: boolean;
};

function isAccessible_(
  shouldRunSynchronously: false,
  path: string,
  options: IsAccessibleOptions
): Promise<boolean>;
function isAccessible_(
  shouldRunSynchronously: true,
  path: string,
  options: IsAccessibleOptions
): boolean;
function isAccessible_(
  shouldRunSynchronously: boolean,
  path: string,
  { useCached, ...cacheIdComponentsObject }: IsAccessibleOptions
): Promisable<boolean> {
  const { fsConstant = fsConstants.R_OK } = cacheIdComponentsObject;

  type Memoization = (
    ...args: [typeof path, typeof cacheIdComponentsObject]
  ) => ReturnType<typeof isAccessible_>;

  if (useCached) {
    const cachedResult = memoizer.get<Memoization>(
      isAccessible_ as unknown as Memoization,
      [path, cacheIdComponentsObject]
    );

    if (cachedResult) {
      return shouldRunSynchronously ? cachedResult : Promise.resolve(cachedResult);
    }
  }

  if (path.startsWith('file:')) {
    path = fileURLToPath(path);
  }

  if (shouldRunSynchronously) {
    try {
      accessSync(path, fsConstant);
      return finalize(true);
    } catch {
      return finalize(false);
    }
  } else {
    return accessAsync(path, fsConstant).then(
      () => finalize(true),
      () => finalize(false)
    );
  }

  function finalize(result: boolean) {
    memoizer.set<Memoization>(
      isAccessible_ as unknown as Memoization,
      [path, cacheIdComponentsObject],
      result
    );

    return result;
  }
}

/**
 * Sugar for asynchronous `access(path, fsConstant)` that returns `true` or
 * `false` rather than rejecting or resolving to `undefined`. Also supports
 * `file:///` protocol URL paths.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function isAccessible(...args: ParametersNoFirst<typeof isAccessible_>) {
  return isAccessible_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace isAccessible {
  /**
   * Sugar for the synchronous `access(path, fsConstant)` that returns `true` or
   * `false` rather than throwing or returning `void`. Also supports `file:///`
   *   protocol URL paths.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function (...args) {
    return isAccessible_(true, ...args);
  } as SyncVersionOf<typeof isAccessible>;
}
