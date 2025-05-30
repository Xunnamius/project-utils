[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-package-build-targets](../README.md) / GatherPackageBuildTargetsOptions

# Type Alias: GatherPackageBuildTargetsOptions

> **GatherPackageBuildTargetsOptions** = `object`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:85](https://github.com/Xunnamius/projector/blob/2730a290426f956d4d09df6f5838fcf6186fbf1f/packages/graph/src/analysis/gather-package-build-targets.ts#L85)

## See

[gatherPackageBuildTargets](../functions/gatherPackageBuildTargets.md)

## Properties

### allowMultiversalImports

> **allowMultiversalImports**: `boolean`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:98](https://github.com/Xunnamius/projector/blob/2730a290426f956d4d09df6f5838fcf6186fbf1f/packages/graph/src/analysis/gather-package-build-targets.ts#L98)

If `true`, multiversal import support will be enabled.

***

### excludeInternalsPatterns?

> `optional` **excludeInternalsPatterns**: `string`[]

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:117](https://github.com/Xunnamius/projector/blob/2730a290426f956d4d09df6f5838fcf6186fbf1f/packages/graph/src/analysis/gather-package-build-targets.ts#L117)

Exclude paths from the internals result with respect to the patterns in
`excludeInternalsPatterns`, which are interpreted according to gitignore
rules and _always_ relative to the _project_ (NEVER package or filesystem!)
root.

#### Default

```ts
[]
```

***

### includeExternalsPatterns?

> `optional` **includeExternalsPatterns**: `string`[]

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:125](https://github.com/Xunnamius/projector/blob/2730a290426f956d4d09df6f5838fcf6186fbf1f/packages/graph/src/analysis/gather-package-build-targets.ts#L125)

Include in the externals result all paths matching a pattern in
`includeExternalsPatterns`, which are interpreted as glob strings and
_always_ relative to the _project_ (NEVER package or filesystem!) root.

#### Default

```ts
[]
```

***

### includeInternalTestFiles

> **includeInternalTestFiles**: `boolean`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:108](https://github.com/Xunnamius/projector/blob/2730a290426f956d4d09df6f5838fcf6186fbf1f/packages/graph/src/analysis/gather-package-build-targets.ts#L108)

If `true`, files under `./test` will be treated the same as files under
`./src`. Testversal imports will also be allowed.

If `false`, `./test` files files will be ignored and testverse imports are
not allowed.

Most invocations of this function should set this to `false`.

***

### useCached

> **useCached**: `boolean`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:94](https://github.com/Xunnamius/projector/blob/2730a290426f956d4d09df6f5838fcf6186fbf1f/packages/graph/src/analysis/gather-package-build-targets.ts#L94)

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
