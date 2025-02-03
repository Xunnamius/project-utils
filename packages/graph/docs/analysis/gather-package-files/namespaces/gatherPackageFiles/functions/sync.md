[**@-xun/project-graph**](../../../../../README.md)

***

[@-xun/project-graph](../../../../../README.md) / [analysis/gather-package-files](../../../README.md) / [gatherPackageFiles](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): [`PackageFiles`](../../../../../common/type-aliases/PackageFiles.md)

Defined in: [packages/graph/src/analysis/gather-package-files.ts:254](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/analysis/gather-package-files.ts#L254)

Synchronously construct a [PackageFiles](../../../../../common/type-aliases/PackageFiles.md) instance containing
AbsolutePaths to every file under `package_`'s root.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

## Parameters

### arguments\_

...\[`GenericPackage`, [`GatherPackageFilesOptions`](../../../type-aliases/GatherPackageFilesOptions.md)\]

## Returns

[`PackageFiles`](../../../../../common/type-aliases/PackageFiles.md)
