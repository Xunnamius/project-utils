[**@-xun/project-graph**](../../../../../README.md)

***

[@-xun/project-graph](../../../../../README.md) / [analysis/gather-package-files](../../../README.md) / [gatherPackageFiles](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): [`PackageFiles`](../../../../../common/type-aliases/PackageFiles.md)

Defined in: [packages/graph/src/analysis/gather-package-files.ts:251](https://github.com/Xunnamius/projector/blob/2730a290426f956d4d09df6f5838fcf6186fbf1f/packages/graph/src/analysis/gather-package-files.ts#L251)

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
