[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [gatherPackageBuildTargets](../README.md) / sync

# Variable: sync

> `const` **sync**: `SyncVersionOf`\<*typeof* [`gatherPackageBuildTargets`](../../../functions/gatherPackageBuildTargets.md)\>

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-build-targets.d.ts:103

Synchronously construct a [PackageBuildTargets](../../../type-aliases/PackageBuildTargets.md) instance derived from
a [Package](../../../type-aliases/Package.md) instance.

Also performs a lightweight correctness check of all imports as they're
encountered.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.
