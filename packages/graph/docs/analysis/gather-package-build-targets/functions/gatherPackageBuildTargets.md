[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-package-build-targets](../README.md) / gatherPackageBuildTargets

# Function: gatherPackageBuildTargets()

> **gatherPackageBuildTargets**(...`args`): `Promise`\<[`PackageBuildTargets`](../../../common/type-aliases/PackageBuildTargets.md)\>

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:542](https://github.com/Xunnamius/projector/blob/ea32adc50974a6b6b82e71ee97678647e4be8f84/packages/graph/src/analysis/gather-package-build-targets.ts#L542)

Asynchronously construct a [PackageBuildTargets](../../../common/type-aliases/PackageBuildTargets.md) instance derived from
a Package instance.

Also performs a lightweight correctness check of all imports as they're
encountered.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Parameters

### args

...\[`GenericPackage`, [`GatherPackageBuildTargetsOptions`](../type-aliases/GatherPackageBuildTargetsOptions.md)\]

## Returns

`Promise`\<[`PackageBuildTargets`](../../../common/type-aliases/PackageBuildTargets.md)\>
