[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / ReadXPackageJsonAtRootOptions

# Type Alias: ReadXPackageJsonAtRootOptions

> **ReadXPackageJsonAtRootOptions**: `object`

Defined in: packages/fs/dist/packages/fs/src/system/read-xpackage-json-at-root.d.ts:7

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
[readJson](../namespaces/readJson/README.md).

## See

[readXPackageJsonAtRoot](../functions/readXPackageJsonAtRoot.md)
