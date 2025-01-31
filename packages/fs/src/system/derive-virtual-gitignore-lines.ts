import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

import { cache, CacheScope } from '@-xun/cache';
import { type AbsolutePath } from '@-xun/fs';
import { runNoRejectOnBadExit } from '@-xun/run';

import { ProjectError } from 'multiverse+common:error.ts';

import { commonDebug } from 'universe+fs:common.ts';
import { FsErrorMessage } from 'universe+fs:error.ts';

import type { Promisable } from 'type-fest';
import type { ParametersNoFirst } from 'multiverse+common:types.ts';

const debug = commonDebug.extend('deriveVirtualGitignoreLines');

const alwaysIgnored = ['.git'];

export type DeriveVirtualGitignoreLinesOptions = {
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
   * If `true`, include any paths unknown to git.
   *
   * @default false
   */
  includeUnknownPaths?: boolean;
};

function deriveVirtualGitignoreLines_(
  shouldRunSynchronously: false,
  projectRoot: AbsolutePath,
  options: DeriveVirtualGitignoreLinesOptions
): Promise<string[]>;
function deriveVirtualGitignoreLines_(
  shouldRunSynchronously: true,
  projectRoot: AbsolutePath,
  options: DeriveVirtualGitignoreLinesOptions
): string[];
function deriveVirtualGitignoreLines_(
  shouldRunSynchronously: boolean,
  projectRoot: AbsolutePath,
  { useCached, ...cacheIdComponentsObject }: DeriveVirtualGitignoreLinesOptions
): Promisable<string[]> {
  const { includeUnknownPaths = false } = cacheIdComponentsObject;

  if (useCached) {
    const cachedIgnored = cache.get(CacheScope.DeriveVirtualGitignoreLines, [
      projectRoot,
      cacheIdComponentsObject
    ]);

    if (cachedIgnored) {
      debug('reusing cached resources: %O', cachedIgnored);
      return shouldRunSynchronously ? cachedIgnored : Promise.resolve(cachedIgnored);
    }
  }

  if (shouldRunSynchronously) {
    if (includeUnknownPaths) {
      throw new ProjectError(FsErrorMessage.DeriverAsyncConfigurationConflict());
    }

    try {
      return finalize(
        alwaysIgnored.concat(
          readFileSync(`${projectRoot}/.gitignore`, 'utf8')
            .split('\n')
            .filter((entry) => entry && !entry.startsWith('#'))
        )
      );
    } catch (error) {
      debug.error(error);
      return finalize(alwaysIgnored);
    }
  } else {
    return readFileAsync(`${projectRoot}/.gitignore`, 'utf8')
      .then(async (content) => {
        const ignore = content
          .split('\n')
          .filter((entry) => entry && !entry.startsWith('#'));

        if (includeUnknownPaths) {
          const { stdout } = await runNoRejectOnBadExit('git', [
            'ls-files',
            '--others',
            '--directory'
          ]);

          const unknownPaths = stdout
            .split('\n')
            .filter((l) => !alwaysIgnored.includes(l));

          ignore.push(...unknownPaths);
        }

        return finalize(alwaysIgnored.concat(ignore));
      })
      .catch((error: unknown) => {
        debug.error(error);
        return finalize(alwaysIgnored);
      });
  }

  function finalize(ignores: string[]) {
    cache.set(
      CacheScope.DeriveVirtualGitignoreLines,
      [projectRoot, cacheIdComponentsObject],
      ignores
    );

    return ignores;
  }
}

/**
 * Asynchronously return an array of the lines of a `.gitignore` file, or an
 * empty array if an error occurs. The string '.git' is prepended to the result.
 *
 * You can optionally include paths unknown to git as well via
 * `includeUnknownPaths`.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function deriveVirtualGitignoreLines(
  ...args: ParametersNoFirst<typeof deriveVirtualGitignoreLines_>
) {
  return deriveVirtualGitignoreLines_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace deriveVirtualGitignoreLines {
  /**
   * Synchronously return an array of the lines of a `.gitignore` file, or an
   * empty array if an error occurs. The string '.git' is prepended to the
   * result.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function (
    projectRoot: AbsolutePath,
    options: Omit<DeriveVirtualGitignoreLinesOptions, 'includeUnknownPaths'>
  ): Awaited<ReturnType<typeof deriveVirtualGitignoreLines>> {
    return deriveVirtualGitignoreLines_(true, projectRoot, options);
  };
}
