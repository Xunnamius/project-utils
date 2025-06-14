[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-xpackage-json-at-root](../README.md) / ReadXPackageJsonAtRootOptions

# Type Alias: ReadXPackageJsonAtRootOptions

> **ReadXPackageJsonAtRootOptions** = `object`

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:23](https://github.com/Xunnamius/projector/blob/9d3f5062654f593f52477505927007c896136ff7/packages/fs/src/system/read-xpackage-json-at-root.ts#L23)

## See

[readXPackageJsonAtRoot](../functions/readXPackageJsonAtRoot.md)

## Properties

### try?

> `optional` **try**: `boolean`

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:40](https://github.com/Xunnamius/projector/blob/9d3f5062654f593f52477505927007c896136ff7/packages/fs/src/system/read-xpackage-json-at-root.ts#L40)

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

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:30](https://github.com/Xunnamius/projector/blob/9d3f5062654f593f52477505927007c896136ff7/packages/fs/src/system/read-xpackage-json-at-root.ts#L30)

Use the internal cached result from a previous run, if available.

The caching behavior of this function is identical to that of
[readJson](../../read-json/functions/readJson.md).
