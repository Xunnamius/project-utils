[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/extract-examples-from-document](../README.md) / ExtractExamplesFromDocumentOptions

# Type Alias: ExtractExamplesFromDocumentOptions

> **ExtractExamplesFromDocumentOptions** = `object`

Defined in: [packages/fs/src/system/extract-examples-from-document.ts:21](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/extract-examples-from-document.ts#L21)

## See

[extractExamplesFromDocument](../functions/extractExamplesFromDocument.md)

## Properties

### asRegExp?

> `optional` **asRegExp**: `boolean`

Defined in: [packages/fs/src/system/extract-examples-from-document.ts:37](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/extract-examples-from-document.ts#L37)

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

Defined in: [packages/fs/src/system/extract-examples-from-document.ts:46](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/extract-examples-from-document.ts#L46)

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
