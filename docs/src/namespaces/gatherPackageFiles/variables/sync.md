[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [gatherPackageFiles](../README.md) / sync

# Variable: sync

> `const` **sync**: `SyncVersionOf`\<*typeof* [`gatherPackageFiles`](../../../functions/gatherPackageFiles.md)\>

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-files.d.ts:60

Synchronously construct a [PackageFiles](../../../type-aliases/PackageFiles.md) instance containing
AbsolutePaths to every file under `package_`'s root.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.
