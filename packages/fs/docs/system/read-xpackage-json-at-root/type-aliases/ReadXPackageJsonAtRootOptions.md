[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-xpackage-json-at-root](../README.md) / ReadXPackageJsonAtRootOptions

# Type Alias: ReadXPackageJsonAtRootOptions

> **ReadXPackageJsonAtRootOptions**: `object`

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:23](https://github.com/Xunnamius/projector/blob/f4ac1fc5dfe0c775c2a6a91230908c438ca26815/packages/fs/src/system/read-xpackage-json-at-root.ts#L23)

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

The caching behavior of this function is identical to that of
[readJson](../../read-json/functions/readJson.md).

## See

[readXPackageJsonAtRoot](../functions/readXPackageJsonAtRoot.md)
