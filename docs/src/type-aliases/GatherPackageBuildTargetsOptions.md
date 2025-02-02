[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / GatherPackageBuildTargetsOptions

# Type Alias: GatherPackageBuildTargetsOptions

> **GatherPackageBuildTargetsOptions**: `object`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-build-targets.d.ts:32

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
