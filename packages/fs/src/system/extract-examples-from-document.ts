import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { memoizer } from '@-xun/memoize';

import type { Promisable } from 'type-fest';
import type { ParametersNoFirst } from 'multiverse+common:types.ts';

const multiSpaceRegExp = /\s{2,}/g;

/**
 * Matches an example region comment and its corresponding region itself.
 */
const exampleRegionIdMatcherRegExp =
  /^<!-- example-region (\S+) -->(?:\s*\n)?(?:(?:```+[^\n]*?\n(.*?)\n?```+)|(?:\s*<pre>\s*<code>\n?(.*?)\n?\s*<\/code>\s*<\/pre>\s*))$/gims;

/**
 * @see {@link extractExamplesFromDocument}
 */
export type ExtractExamplesFromDocumentOptions = {
  /**
   * If `true`, the value returned by `extractExamplesFromDocument` will take
   * the form `Map<string, RegExp>` where each example region is mapped to a
   * regular expression representing that example. Newlines will be preserved
   * (as `\n` characters), but multiple space characters will be collapsed and
   * replaced with a single `\s+`. All other characters in the example text will
   * be escaped using `RegExp.escape`.
   *
   * Returning a regular expression representing the example text instead of the
   * text itself is useful when the real output contains a variable number of
   * spaces, such as when examining CLI output that expands to fill the
   * available terminal width.
   *
   * @default false
   */
  asRegExp?: boolean;
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

function extractExamplesFromDocument_(
  shouldRunSynchronously: false,
  path: string,
  options: ExtractExamplesFromDocumentOptions
): Promise<Map<string, string | RegExp>>;
function extractExamplesFromDocument_(
  shouldRunSynchronously: true,
  path: string,
  options: ExtractExamplesFromDocumentOptions
): Map<string, string | RegExp>;
function extractExamplesFromDocument_(
  shouldRunSynchronously: boolean,
  path: string,
  { useCached, ...cacheIdComponentsObject }: ExtractExamplesFromDocumentOptions
): Promisable<Map<string, string | RegExp>> {
  const { asRegExp = false } = cacheIdComponentsObject;

  type Memoization = (
    ...args: [typeof path, typeof cacheIdComponentsObject]
  ) => ReturnType<typeof extractExamplesFromDocument_>;

  if (useCached) {
    const cachedResult = memoizer.get<Memoization>(
      extractExamplesFromDocument_ as unknown as Memoization,
      [path, cacheIdComponentsObject]
    );

    if (cachedResult) {
      return shouldRunSynchronously ? cachedResult : Promise.resolve(cachedResult);
    }
  }

  if (path.startsWith('file:')) {
    path = fileURLToPath(path);
  }

  return shouldRunSynchronously
    ? extractExampleRegions(readFileSync(path, { encoding: 'utf8' }))
    : readFileAsync(path, { encoding: 'utf8' }).then((fileContents) =>
        extractExampleRegions(fileContents)
      );

  function extractExampleRegions(text: string) {
    const regions = new Map<string, string | RegExp>(
      text
        .matchAll(exampleRegionIdMatcherRegExp)
        .map(([, regionId, regionContents1, regionContents2]) => [
          // ? RegExp should make it impossible to be an empty string/undefined
          regionId!,
          // ? RegExp should make it impossible to be undefined
          maybeTransformToRegExp(regionContents1 ?? regionContents2!)
        ])
    );

    memoizer.set<Memoization>(
      extractExamplesFromDocument_ as unknown as Memoization,
      [path, cacheIdComponentsObject],
      regions
    );

    return regions;
  }

  function maybeTransformToRegExp(text: string) {
    if (asRegExp) {
      const splitByNewlines = text.split('\n').map((line) =>
        line
          .split(multiSpaceRegExp)
          .map((substr) => RegExp.escape(substr))
          .join(String.raw`\s+`)
      );

      return new RegExp(`^${splitByNewlines.join(String.raw`\n`)}$`);
    } else {
      return text;
    }
  }
}

/**
 * This function returns a mapping of identifiers to code blocks by searching
 * the document at `path` for _example regions_. Example regions are code blocks
 * in Markdown style (3+ backticks, e.g. ```` ```js\n...\n``` ````) or HTML
 * style (e.g. `<pre><code lang="js">\n...\n</code></pre>`) that are preceded by
 * a "special" HTML/Markdown comment denoting the block as an example region.
 *
 * For example:
 *
 * ````markdown
 * <!-- example-region id -->
 *
 * ```js
 *   const myCodeExample = 'goes here';
 * ```
 * ````
 *
 * Where `id` is a non-zero-length string that will become the identifier mapped
 * to its respective code block, both of which are returned by this function.
 *
 * The only characters that can separate the special example region comment from
 * its code block are whitespace characters (including newlines). If any other
 * characters appear between the code block and its identifier, it will not be
 * recognized as an example region and will be ignored.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function extractExamplesFromDocument(
  path: string,
  options: ExtractExamplesFromDocumentOptions & { asRegExp?: false }
): Promise<Map<string, string>>;
export function extractExamplesFromDocument(
  path: string,
  options: ExtractExamplesFromDocumentOptions
): Promise<Map<string, RegExp>>;
export function extractExamplesFromDocument(
  ...args: ParametersNoFirst<typeof extractExamplesFromDocument_>
) {
  return extractExamplesFromDocument_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace extractExamplesFromDocument {
  /**
   * This function returns a mapping of identifiers to code blocks by searching
   * the document at `path` for _example regions_. Example regions are code
   * blocks in Markdown style (3+ backticks, e.g. ```` ```js\n...\n``` ````) or
   * HTML style (e.g. `<pre><code lang="js">\n...\n</code></pre>`) that are
   * preceded by a "special" HTML/Markdown comment denoting the block as an
   * example region.
   *
   * For example:
   *
   * ````markdown
   * <!-- example-region id -->
   *
   * ```js
   *   const myCodeExample = 'goes here';
   * ```
   * ````
   *
   * Where `id` is a non-zero-length string that will become the identifier
   * mapped to its respective code block, both of which are returned by this
   * function.
   *
   * The only characters that can separate the special example region comment
   * from its code block are whitespace characters (including newlines). If any
   * other characters appear between the code block and its identifier, it will
   * not be recognized as an example region and will be ignored.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  function extractExamplesFromDocumentSync(
    path: string,
    options: ExtractExamplesFromDocumentOptions & { asRegExp?: false }
  ): Map<string, string>;
  function extractExamplesFromDocumentSync(
    path: string,
    options: ExtractExamplesFromDocumentOptions
  ): Map<string, RegExp>;
  function extractExamplesFromDocumentSync(
    ...args: ParametersNoFirst<typeof extractExamplesFromDocument_>
  ) {
    return extractExamplesFromDocument_(true, ...args);
  }

  export const sync = extractExamplesFromDocumentSync;
}
