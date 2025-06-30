[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-package-files](../README.md) / gatherPackageFiles

# Function: gatherPackageFiles()

> **gatherPackageFiles**(...`args`): `Promise`\<[`PackageFiles`](../../../common/type-aliases/PackageFiles.md)\>

Defined in: [packages/graph/src/analysis/gather-package-files.ts:233](https://github.com/Xunnamius/projector/blob/30ee33dd3f520f95da3402a4b1c6901f010100cc/packages/graph/src/analysis/gather-package-files.ts#L233)

Asynchronously construct a [PackageFiles](../../../common/type-aliases/PackageFiles.md) instance containing
AbsolutePaths to every file under `package_`'s root.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Parameters

### args

...\[`GenericPackage`, [`GatherPackageFilesOptions`](../type-aliases/GatherPackageFilesOptions.md)\]

## Returns

`Promise`\<[`PackageFiles`](../../../common/type-aliases/PackageFiles.md)\>
