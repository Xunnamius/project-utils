/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

import { memoizer } from '@-xun/memoize';

import { ProjectError } from 'multiverse+common:error.ts';
import { commonDebug } from 'multiverse+fs:common.ts';

import { FsErrorMessage } from 'universe+fs:error.ts';

import type { AbsolutePath } from '@-xun/fs';
import type { EmptyObject, JsonValue, Promisable } from 'type-fest';
import type { ParametersNoFirst } from 'multiverse+common:types.ts';

const debug = commonDebug.extend('readJson');

/**
 * @see {@link readJson}
 */
export type ReadJsonOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * Unless `useCached` is `false`, the results returned by this function will
   * always strictly equal (`===`) each other with respect to call signature.
   *
   * @see {@link cache}
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

function readJson_<T>(
  shouldRunSynchronously: false,
  path: AbsolutePath,
  options: ReadJsonOptions
): Promise<T | EmptyObject>;
function readJson_<T>(
  shouldRunSynchronously: true,
  path: AbsolutePath,
  options: ReadJsonOptions
): T | EmptyObject;
function readJson_<T>(
  shouldRunSynchronously: boolean,
  path: AbsolutePath,
  { useCached, try: try_, ...cacheIdComponentsObject }: ReadJsonOptions
): Promisable<T | EmptyObject> {
  type Memoization = (
    ...args: [typeof path, typeof cacheIdComponentsObject]
  ) => ReturnType<typeof readJson_>;

  if (useCached) {
    const cachedResult = memoizer.get<Memoization>(readJson_ as unknown as Memoization, [
      path,
      cacheIdComponentsObject
    ]) as T;

    if (cachedResult) {
      return shouldRunSynchronously ? cachedResult : Promise.resolve(cachedResult);
    }
  }

  if (shouldRunSynchronously) {
    try {
      const rawJson = (() => {
        try {
          return readFileSync(path, 'utf8');
        } catch (error) {
          throw new ProjectError(FsErrorMessage.NotReadable(path), { cause: error });
        }
      })();

      return parse(rawJson);
    } catch (error) {
      return handleError(error);
    }
  } else {
    return readFileAsync(path, 'utf8')
      .then(
        (rawJson) => {
          return parse(rawJson);
        },
        (error: unknown) => {
          throw new ProjectError(FsErrorMessage.NotReadable(path), { cause: error });
        }
      )
      .catch(handleError);
  }

  function parse(rawJson: string): T {
    try {
      const result = JSON.parse(rawJson);

      memoizer.set<Memoization>(
        readJson_ as unknown as Memoization,
        [path, cacheIdComponentsObject],
        result
      );

      return result;
    } catch (error) {
      throw new ProjectError(FsErrorMessage.NotParsable(path), { cause: error });
    }
  }

  function handleError(error: unknown): T | never {
    if (try_) {
      debug.warn(
        'attempt to read json file failed (this error will be ignored): %O',
        error
      );

      return {} as T;
    }

    throw error;
  }
}

/**
 * Asynchronously read in and parse the contents of an arbitrary JSON file.
 *
 * Use the template variable (`T`) to bring your own types. Otherwise, it
 * defaults to {@link JsonValue}.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function readJson<T = JsonValue>(
  path: AbsolutePath,
  options: ReadJsonOptions & { try?: false }
): Promise<T>;
export function readJson<T = JsonValue>(
  path: AbsolutePath,
  options: ReadJsonOptions
): Promise<T | EmptyObject>;
export function readJson<T = JsonValue>(
  ...args: ParametersNoFirst<typeof readJson_<T>>
) {
  return readJson_<T>(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace readJson {
  /**
   * Synchronously read in and parse the contents of an arbitrary JSON file.
   *
   * Use the template variable (`T`) to bring your own types. Otherwise, it
   * defaults to {@link JsonValue}.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  function readJsonSync<T = JsonValue>(
    path: AbsolutePath,
    options: ReadJsonOptions & { try?: false }
  ): T;
  function readJsonSync<T = JsonValue>(
    path: AbsolutePath,
    options: ReadJsonOptions
  ): T | EmptyObject;
  function readJsonSync<T = JsonValue>(...args: ParametersNoFirst<typeof readJson_<T>>) {
    return readJson_<T>(true, ...args);
  }

  export const sync = readJsonSync;
}
