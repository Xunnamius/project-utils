[**@-xun/project-graph**](../../../../../README.md)

***

[@-xun/project-graph](../../../../../README.md) / [analysis/gather-package-build-targets](../../../README.md) / [gatherPackageBuildTargets](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): [`PackageBuildTargets`](../../../../../common/type-aliases/PackageBuildTargets.md)

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:611](https://github.com/Xunnamius/projector/blob/8b829a35843b6bd00f87495a6c64e0da9cfd40e7/packages/graph/src/analysis/gather-package-build-targets.ts#L611)

Synchronously construct a [PackageBuildTargets](../../../../../common/type-aliases/PackageBuildTargets.md) instance derived from
a Package instance.

Also performs a lightweight correctness check of all imports as they're
encountered.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

## Parameters

### arguments\_

...\[`GenericPackage`, [`GatherPackageBuildTargetsOptions`](../../../type-aliases/GatherPackageBuildTargetsOptions.md)\]

## Returns

[`PackageBuildTargets`](../../../../../common/type-aliases/PackageBuildTargets.md)
