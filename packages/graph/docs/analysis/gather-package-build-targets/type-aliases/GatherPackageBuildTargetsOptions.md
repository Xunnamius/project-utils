[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-package-build-targets](../README.md) / GatherPackageBuildTargetsOptions

# Type Alias: GatherPackageBuildTargetsOptions

> **GatherPackageBuildTargetsOptions**: `object`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:81](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/analysis/gather-package-build-targets.ts#L81)

## Type declaration

### allowMultiversalImports

> **allowMultiversalImports**: `boolean`

If `true`, multiversal import support will be enabled.

### excludeInternalsPatterns?

> `optional` **excludeInternalsPatterns**: `string`[]

Exclude paths from the internals result with respect to the patterns in
`excludeInternalsPatterns`, which are interpreted according to gitignore
rules and _always_ relative to the _project_ (NEVER package or filesystem!)
root.

### includeExternalsPatterns?

> `optional` **includeExternalsPatterns**: `string`[]

Include in the externals result all paths matching a pattern in
`includeExternalsPatterns`, which are interpreted as glob strings and
_always_ relative to the _project_ (NEVER package or filesystem!) root.

### useCached

> **useCached**: `boolean`

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache

## See

[gatherPackageBuildTargets](../functions/gatherPackageBuildTargets.md)
