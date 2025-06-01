[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-json](../README.md) / ReadJsonOptions

# Type Alias: ReadJsonOptions

> **ReadJsonOptions** = `object`

Defined in: [packages/fs/src/system/read-json.ts:21](https://github.com/Xunnamius/projector/blob/046ef48bf5d245c4f1a27d7c884708b74af0a9d1/packages/fs/src/system/read-json.ts#L21)

## See

[readJson](../functions/readJson.md)

## Properties

### try?

> `optional` **try**: `boolean`

Defined in: [packages/fs/src/system/read-json.ts:40](https://github.com/Xunnamius/projector/blob/046ef48bf5d245c4f1a27d7c884708b74af0a9d1/packages/fs/src/system/read-json.ts#L40)

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

Defined in: [packages/fs/src/system/read-json.ts:30](https://github.com/Xunnamius/projector/blob/046ef48bf5d245c4f1a27d7c884708b74af0a9d1/packages/fs/src/system/read-json.ts#L30)

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
