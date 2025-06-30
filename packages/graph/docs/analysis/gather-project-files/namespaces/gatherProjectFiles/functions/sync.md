[**@-xun/project-graph**](../../../../../README.md)

***

[@-xun/project-graph](../../../../../README.md) / [analysis/gather-project-files](../../../README.md) / [gatherProjectFiles](../README.md) / sync

# Function: sync()

> **sync**(`projectMetadata`, `options`): [`ProjectFiles`](../../../../../common/type-aliases/ProjectFiles.md)

Defined in: [packages/graph/src/analysis/gather-project-files.ts:487](https://github.com/Xunnamius/projector/blob/8083fdfb8119466a16efa45bfe532af41d9ff256/packages/graph/src/analysis/gather-project-files.ts#L487)

Synchronously construct a [ProjectFiles](../../../../../common/type-aliases/ProjectFiles.md) instance containing absolute
file paths (AbsolutePaths) derived from `projectMetadata`.

Note that **only named packages** are considered "packages" in monorepos.
Unnamed and broken packages/workspaces are ignored except when constructing
`packageJsonFiles.elsewhere`.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

## Parameters

### projectMetadata

`GenericProjectMetadata`

### options

`Omit`\<[`GatherProjectFilesOptions`](../../../type-aliases/GatherProjectFilesOptions.md), `"skipUnknown"`\>

## Returns

[`ProjectFiles`](../../../../../common/type-aliases/ProjectFiles.md)
