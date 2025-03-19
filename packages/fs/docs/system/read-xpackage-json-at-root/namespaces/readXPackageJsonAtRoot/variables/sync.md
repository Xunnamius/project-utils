[**@-xun/project-fs**](../../../../../README.md)

***

[@-xun/project-fs](../../../../../README.md) / [system/read-xpackage-json-at-root](../../../README.md) / [readXPackageJsonAtRoot](../README.md) / sync

# Variable: sync()

> `const` **sync**: (`path`, `options`) => `XPackageJson`(`path`, `options`) => `EmptyObject` \| `XPackageJson` = `readXPackageJsonAtRootSync`

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:156](https://github.com/Xunnamius/projector/blob/7eae313be5b26fe85e1c6ce76044bc731b50b838/packages/fs/src/system/read-xpackage-json-at-root.ts#L156)

Synchronously read in and parse the contents of a package.json file.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
`cache.clear`.

## Parameters

### path

`AbsolutePath`

### options

[`ReadXPackageJsonAtRootOptions`](../../../type-aliases/ReadXPackageJsonAtRootOptions.md) & `object`

## Returns

`XPackageJson`

## See

[readJson](../../../../read-json/functions/readJson.md) (the function that actually does the reading/caching)

Synchronously read in and parse the contents of a package.json file.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
`cache.clear`.

## Parameters

### path

`AbsolutePath`

### options

[`ReadXPackageJsonAtRootOptions`](../../../type-aliases/ReadXPackageJsonAtRootOptions.md)

## Returns

`EmptyObject` \| `XPackageJson`

## See

[readJson](../../../../read-json/functions/readJson.md) (the function that actually does the reading/caching)
