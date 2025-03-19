[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/extract-examples-from-document](../README.md) / extractExamplesFromDocument

# Function: extractExamplesFromDocument()

> **extractExamplesFromDocument**(...`args`): `Promise`\<`Map`\<`string`, `string`\>\>

Defined in: [packages/fs/src/system/extract-examples-from-document.ts:123](https://github.com/Xunnamius/projector/blob/124f6e6b6e700d669a6e7832c4ad15585be7dc80/packages/fs/src/system/extract-examples-from-document.ts#L123)

This function returns a mapping of identifiers to code blocks by searching
the document at `path` for _example regions_. Example regions are code blocks
in Markdown style (3+ backticks, e.g. ```` ```js\n...\n``` ````) or HTML
style (e.g. `<pre><code lang="js">\n...\n</code></pre>`) that are preceded by
a "special" HTML/Markdown comment denoting the block as an example region.

For example:

````markdown
<!-- example-region id -->

```js
  const myCodeExample = 'goes here';
```
````

Where `id` is a non-zero-length string that will become the identifier mapped
to its respective code block, both of which are returned by this function.

The only characters that can separate the special example region comment from
its code block are whitespace characters (including newlines). If any other
characters appear between the code block and its identifier, it will not be
recognized as an example region and will be ignored.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Parameters

### args

...\[`string`, [`ExtractExamplesFromDocumentOptions`](../type-aliases/ExtractExamplesFromDocumentOptions.md)\]

## Returns

`Promise`\<`Map`\<`string`, `string`\>\>
