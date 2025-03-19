[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / ExtractExamplesFromDocumentOptions

# Type Alias: ExtractExamplesFromDocumentOptions

> **ExtractExamplesFromDocumentOptions** = `object`

Defined in: packages/fs/dist/packages/fs/src/system/extract-examples-from-document.d.ts:4

## See

[extractExamplesFromDocument](../functions/extractExamplesFromDocument.md)

## Properties

### asRegExp?

> `optional` **asRegExp**: `boolean`

Defined in: packages/fs/dist/packages/fs/src/system/extract-examples-from-document.d.ts:20

If `true`, the value returned by `extractExamplesFromDocument` will take
the form `Map<string, RegExp>` where each example region is mapped to a
regular expression representing that example. Newlines will be preserved
(as `\n` characters), but multiple space characters will be collapsed and
replaced with a single `\s+`. All other characters in the example text will
be escaped using `RegExp.escape`.

Returning a regular expression representing the example text instead of the
text itself is useful when the real output contains a variable number of
spaces, such as when examining CLI output that expands to fill the
available terminal width.

#### Default

```ts
false
```

***

### useCached

> **useCached**: `boolean`

Defined in: packages/fs/dist/packages/fs/src/system/extract-examples-from-document.d.ts:29

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
