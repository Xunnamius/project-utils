[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / gatherPackageFiles

# Function: gatherPackageFiles()

> **gatherPackageFiles**(...`args`): `Promise`\<[`PackageFiles`](../type-aliases/PackageFiles.md)\>

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-files.d.ts:48

Asynchronously construct a [PackageFiles](../type-aliases/PackageFiles.md) instance containing
AbsolutePaths to every file under `package_`'s root.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Parameters

### args

...\[[`GenericPackage`](../type-aliases/GenericPackage.md), [`GatherPackageFilesOptions`](../type-aliases/GatherPackageFilesOptions.md)\]

## Returns

`Promise`\<[`PackageFiles`](../type-aliases/PackageFiles.md)\>
