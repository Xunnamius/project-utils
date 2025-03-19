[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-package-build-targets](../README.md) / GatherPackageBuildTargetsOptions

# Type Alias: GatherPackageBuildTargetsOptions

> **GatherPackageBuildTargetsOptions** = `object`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:80](https://github.com/Xunnamius/projector/blob/dcaa0a5acffff6ad085fbc2675121bb9ec6c0aeb/packages/graph/src/analysis/gather-package-build-targets.ts#L80)

## See

[gatherPackageBuildTargets](../functions/gatherPackageBuildTargets.md)

## Properties

### allowMultiversalImports

> **allowMultiversalImports**: `boolean`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:93](https://github.com/Xunnamius/projector/blob/dcaa0a5acffff6ad085fbc2675121bb9ec6c0aeb/packages/graph/src/analysis/gather-package-build-targets.ts#L93)

If `true`, multiversal import support will be enabled.

***

### excludeInternalsPatterns?

> `optional` **excludeInternalsPatterns**: `string`[]

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:100](https://github.com/Xunnamius/projector/blob/dcaa0a5acffff6ad085fbc2675121bb9ec6c0aeb/packages/graph/src/analysis/gather-package-build-targets.ts#L100)

Exclude paths from the internals result with respect to the patterns in
`excludeInternalsPatterns`, which are interpreted according to gitignore
rules and _always_ relative to the _project_ (NEVER package or filesystem!)
root.

***

### includeExternalsPatterns?

> `optional` **includeExternalsPatterns**: `string`[]

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:106](https://github.com/Xunnamius/projector/blob/dcaa0a5acffff6ad085fbc2675121bb9ec6c0aeb/packages/graph/src/analysis/gather-package-build-targets.ts#L106)

Include in the externals result all paths matching a pattern in
`includeExternalsPatterns`, which are interpreted as glob strings and
_always_ relative to the _project_ (NEVER package or filesystem!) root.

***

### useCached

> **useCached**: `boolean`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:89](https://github.com/Xunnamius/projector/blob/dcaa0a5acffff6ad085fbc2675121bb9ec6c0aeb/packages/graph/src/analysis/gather-package-build-targets.ts#L89)

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
