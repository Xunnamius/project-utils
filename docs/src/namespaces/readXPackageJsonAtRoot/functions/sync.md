[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [readXPackageJsonAtRoot](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): `Omit`\<`OmitIndexSignature`\<`PackageJson`\>, `"bin"` \| `"name"`\> & `object`

Defined in: packages/fs/dist/packages/fs/src/system/read-xpackage-json-at-root.d.ts:57

Synchronously read in and parse the contents of a package.json file.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
`cache.clear`.

## Parameters

### arguments\_

...\[`AbsolutePath`, [`ReadXPackageJsonAtRootOptions`](../../../type-aliases/ReadXPackageJsonAtRootOptions.md)\]

## Returns

`Omit`\<`OmitIndexSignature`\<`PackageJson`\>, `"bin"` \| `"name"`\> & `object`

## See

[readJson](../../readJson/README.md) (the function that actually does the reading/caching)
