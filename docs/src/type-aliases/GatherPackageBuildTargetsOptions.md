[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / GatherPackageBuildTargetsOptions

# Type Alias: GatherPackageBuildTargetsOptions

> **GatherPackageBuildTargetsOptions** = `object`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-build-targets.d.ts:32

## See

[gatherPackageBuildTargets](../functions/gatherPackageBuildTargets.md)

## Properties

### allowMultiversalImports

> **allowMultiversalImports**: `boolean`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-build-targets.d.ts:45

If `true`, multiversal import support will be enabled.

***

### excludeInternalsPatterns?

> `optional` **excludeInternalsPatterns**: `string`[]

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-build-targets.d.ts:52

Exclude paths from the internals result with respect to the patterns in
`excludeInternalsPatterns`, which are interpreted according to gitignore
rules and _always_ relative to the _project_ (NEVER package or filesystem!)
root.

***

### includeExternalsPatterns?

> `optional` **includeExternalsPatterns**: `string`[]

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-build-targets.d.ts:58

Include in the externals result all paths matching a pattern in
`includeExternalsPatterns`, which are interpreted as glob strings and
_always_ relative to the _project_ (NEVER package or filesystem!) root.

***

### useCached

> **useCached**: `boolean`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-build-targets.d.ts:41

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
