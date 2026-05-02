[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / ReadJsonOptions

# Type Alias: ReadJsonOptions

> **ReadJsonOptions** = `object`

Defined in: packages/fs/dist/packages/fs/src/system/read-json.d.ts:6

## See

[readJson](../functions/readJson.md)

## Properties

### try?

> `optional` **try?**: `boolean`

Defined in: packages/fs/dist/packages/fs/src/system/read-json.d.ts:25

If `true`, an attempt will be made to read in and parse the JSON file. If
it fails (i.e. an error is thrown), `{}` is returned and no error is
thrown.

Note that, currently, fail results (where `{}` is returned) are not cached.

#### Default

```ts
false
```

***

### useCached

> **useCached**: `boolean`

Defined in: packages/fs/dist/packages/fs/src/system/read-json.d.ts:15

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
