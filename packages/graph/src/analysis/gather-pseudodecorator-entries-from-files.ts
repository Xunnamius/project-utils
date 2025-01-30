import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

import { cache, CacheScope } from '@-xun/cache';
import isValidNpmPackageName from 'validate-npm-package-name';

import { commonDebug } from 'universe+graph:common.ts';

import { type ParametersNoFirst, type SyncVersionOf } from 'typeverse:global.ts';

import type { AbsolutePath } from '@-xun/fs';
import type { Promisable } from 'type-fest';

const debug = commonDebug.extend('gatherPseudodecoratorEntriesFromFiles');

const whitespace = /\s/;
// ? We use this because strange package names like "-" are technically valid.
// ! Cannot use "g" flag
const hasAtLeastOneAlphanumericCharacter = /[a-z0-9]/i;

/**
 * The available {@link Pseudodecorator} tags. These tags must not contain valid
 * RegExp quantifiers or other RegExp control characters.
 */
export enum PseudodecoratorTag {
  /**
   * This pseudodecorator provides a list of package names that should not be
   * considered extraneous (the relevant checks are skipped).
   *
   * **Valid characters**: any character that is valid in an NPM package name.\
   * **Invalid characters**: whitespace and any character that isn't valid in an
   * NPM package name.
   */
  NotExtraneous = '@symbiote/notExtraneous',
  /**
   * This pseudodecorator provides a list of package names that should not be
   * considered invalid (the relevant checks are skipped).
   *
   * **Valid characters**: any character that is valid in an NPM package name.\
   * **Invalid characters**: whitespace and any character that isn't valid in an
   * NPM package name.
   */
  NotInvalid = '@symbiote/notInvalid'
}

// * Lol, the pseudodecorators in the example text below are being picked up by
// * gatherPseudodecoratorEntriesFromFiles_() when run on this very project...
/**
 * A so-called "pseudodecorator" is a decorator-like syntax that can appear
 * anywhere in almost any type of file and is used to pass information to
 * symbiote. They consist of an opening brace "{", a {@link PseudodecoratorTag},
 * an optional delimiter, a _delimited_ list of _valid characters_, an optional
 * delimiter, and a closing brace "}".
 *
 * A "delimiter" is a _series_ of one or more invalid characters that starts and
 * ends with a whitespace character or the final "}" character. This flexible
 * syntax allows pseudodecorators to survive being nested anywhere within almost
 * any document or file type without corruption. Which characters are valid and
 * which are invalid depend on the {@link PseudodecoratorTag} used.
 *
 * For example, using the `@symbiote/notExtraneous` pseudodecorator:
 *
 * **TypeScript:**
 *
 * ```typescript
 * /·*
 *  * {@symbiote/notExtraneous
 *  *   all-contributors-cli remark-cli
 *  *   jest husky
 *  *   doctoc
 *  * }
 *  ·/
 *
 * import { that } from 'there';
 *
 * export function someFunction() {
 *   // ...
 * }
 * ```
 *
 * **JavaScript:**
 *
 * ```javascript
 * // {@symbiote/notExtraneous
 * //  - all-contributors-cli
 * //  - remark-cli
 * //  - jest
 * //  - husky
 * //  - doctoc
 * // }
 *
 * import { that } from 'there';
 *
 * export function someFunction() {
 *   // ...
 * }
 * ```
 *
 * **JSON:**
 *
 * ```json
 * {
 *   "name": "my-package",
 *   "//": "{@symbiote/notExtraneous all-contributors-cli remark-cli jest husky doctoc}"
 * }
 * ```
 *
 * **Markdown:**
 *
 * ```markdown
 * # My Documentation
 * Something or other.
 *
 * <!-- {@symbiote/notExtraneous all-contributors-cli remark-cli jest husky doctoc } -->
 *
 * ## A Subsection
 * More text.
 * ```
 *
 * **And any other type of file** that can contain text. See [the
 * docs](https://github.com/Xunnamius/symbiote/wiki/Generic-Project-Architecture)
 * for more details.
 *
 * @see {@link PseudodecoratorTag}
 */
export type Pseudodecorator = {
  tag: PseudodecoratorTag;
  items: string[];
};

/**
 * An entry mapping an absolute file path to an array of
 * {@link Pseudodecorator}s present in said file.
 *
 * @see {@link gatherPseudodecoratorEntriesFromFiles}
 */
export type PseudodecoratorsEntry = [
  filepath: AbsolutePath,
  decorators: Pseudodecorator[]
];

/**
 * @see {@link PseudodecoratorTag}
 */
export const pseudodecoratorTags = Object.values(PseudodecoratorTag);

/**
 * @see {@link gatherPseudodecoratorEntriesFromFiles}
 */
export type gatherPseudodecoratorEntriesFromFilesOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * **WARNING: the results returned by this function, while functionally
   * identical to each other, will _NOT_ strictly equal (`===`) each other.**
   * However, each {@link PseudodecoratorsEntry} tuple within the returned
   * results _will_ strictly equal each other, respectively.
   *
   * @see {@link cache}
   */
  useCached: boolean;
};

function gatherPseudodecoratorEntriesFromFiles_(
  shouldRunSynchronously: false,
  files: AbsolutePath[],
  options: gatherPseudodecoratorEntriesFromFilesOptions
): Promise<PseudodecoratorsEntry[]>;
function gatherPseudodecoratorEntriesFromFiles_(
  shouldRunSynchronously: true,
  files: AbsolutePath[],
  options: gatherPseudodecoratorEntriesFromFilesOptions
): PseudodecoratorsEntry[];
function gatherPseudodecoratorEntriesFromFiles_(
  shouldRunSynchronously: boolean,
  files: AbsolutePath[],
  { useCached, ...cacheIdComponentsObject }: gatherPseudodecoratorEntriesFromFilesOptions
): Promisable<PseudodecoratorsEntry[]> {
  debug('evaluating files: %O', files);

  if (shouldRunSynchronously) {
    const pseudodecoratorsEntries = files.map((filepath, index) => {
      const dbg = debug.extend(`file-${index}`);
      dbg('evaluating file: %O', filepath);

      if (useCached) {
        const cachedEntry = cache.get(CacheScope.GatherPseudodecoratorEntriesFromFiles, [
          filepath,
          cacheIdComponentsObject
        ]);

        if (cachedEntry) {
          dbg('reusing cached resources: %O', cachedEntry);
          return cachedEntry;
        }
      }

      const decorators = contentsToDecorators(readFileSync(filepath, 'utf8'));
      const entry: PseudodecoratorsEntry = [filepath, decorators];

      debug('new pseudodecorator entry: %O', entry);

      cache.set(
        CacheScope.GatherPseudodecoratorEntriesFromFiles,
        [filepath, cacheIdComponentsObject],
        entry
      );

      return entry;
    });

    debug('pseudodecorator entries: %O', pseudodecoratorsEntries);
    return pseudodecoratorsEntries;
  } else {
    return Promise.all(
      files.map(async (filepath, index) => {
        const dbg = debug.extend(`file-${index}`);
        dbg('evaluating file: %O', filepath);

        if (useCached) {
          const cachedEntry = cache.get(
            CacheScope.GatherPseudodecoratorEntriesFromFiles,
            [filepath, cacheIdComponentsObject]
          );

          if (cachedEntry) {
            dbg('reusing cached resources: %O', cachedEntry);
            return cachedEntry;
          }
        }

        const decorators = contentsToDecorators(await readFileAsync(filepath, 'utf8'));
        const entry: PseudodecoratorsEntry = [filepath, decorators];

        debug('new pseudodecorator entry: %O', entry);

        cache.set(
          CacheScope.GatherPseudodecoratorEntriesFromFiles,
          [filepath, cacheIdComponentsObject],
          entry
        );

        return entry;
      })
    ).then((pseudodecoratorsEntries) => {
      debug('pseudodecorator entries: %O', pseudodecoratorsEntries);
      return pseudodecoratorsEntries;
    });
  }
}

/**
 * Accepts zero or more file paths and asynchronously returns an array of
 * {@link PseudodecoratorsEntry}s each mapping a given file path to an array of
 * {@link Pseudodecorator}s present in said file.
 *
 * This function does _not_ rely on Babel or any other parsers and accepts any
 * file regardless of type or extension.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function gatherPseudodecoratorEntriesFromFiles(
  ...args: ParametersNoFirst<typeof gatherPseudodecoratorEntriesFromFiles_>
) {
  return gatherPseudodecoratorEntriesFromFiles_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherPseudodecoratorEntriesFromFiles {
  /**
   * Accepts zero or more file paths and synchronously returns an array of
   * {@link PseudodecoratorsEntry}s each mapping a given file path to an array
   * of {@link Pseudodecorator}s present in said file.
   *
   * This function does _not_ rely on Babel or any other parsers and accepts any
   * file regardless of type or extension.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function (...args) {
    return gatherPseudodecoratorEntriesFromFiles_(true, ...args);
  } as SyncVersionOf<typeof gatherPseudodecoratorEntriesFromFiles>;
}

function contentsToDecorators(contents: string): Pseudodecorator[] {
  return Array.from(
    contents
      .matchAll(new RegExp(`{(${pseudodecoratorTags.join('|')})([^}]*)}`, 'gi'))
      .map(function ([, rawTag, rawItems]) {
        return {
          tag: rawTag as PseudodecoratorTag,
          items: rawItems.split(whitespace).filter((packageName) => {
            const npmValidationResult = isValidNpmPackageName(
              packageName.replaceAll('~', '_')
            );

            const isValid =
              hasAtLeastOneAlphanumericCharacter.test(packageName) &&
              npmValidationResult.validForNewPackages;

            if (!isValid) {
              debug.warn(
                'encountered invalid pseudodecorator tag content %O: %O',
                packageName,
                npmValidationResult
              );
            }

            return isValid;
          })
        } satisfies Pseudodecorator;
      })
  );
}
