[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-json](../README.md) / ReadJsonOptions

# Type Alias: ReadJsonOptions

> **ReadJsonOptions**: `object`

Defined in: [packages/fs/src/system/read-json.ts:21](https://github.com/Xunnamius/projector/blob/af2aba5aa55ae25931180f8845a9a815a4bb9eeb/packages/fs/src/system/read-json.ts#L21)

## Type declaration

### try?

> `optional` **try**: `boolean`

If `true`, an attempt will be made to read in and parse the JSON file. If
it fails (i.e. an error is thrown), `{}` is returned and no error is
thrown.

Note that, currently, fail results (where `{}` is returned) are not cached.

#### Default

```ts
false
```

### useCached

> **useCached**: `boolean`

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache

## See

[readJson](../functions/readJson.md)
