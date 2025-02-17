[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-xpackage-json-at-root](../README.md) / ReadXPackageJsonAtRootOptions

# Type Alias: ReadXPackageJsonAtRootOptions

> **ReadXPackageJsonAtRootOptions**: `object`

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:12](https://github.com/Xunnamius/projector/blob/1a87550070866e204d98f54387d23c3c57e13502/packages/fs/src/system/read-xpackage-json-at-root.ts#L12)

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
