[**@-xun/project-graph**](../../../../../README.md)

***

[@-xun/project-graph](../../../../../README.md) / [analysis/gather-project-files](../../../README.md) / [gatherProjectFiles](../README.md) / sync

# Function: sync()

> **sync**(`projectMetadata`, `options`): [`ProjectFiles`](../../../../../common/type-aliases/ProjectFiles.md)

Defined in: [packages/graph/src/analysis/gather-project-files.ts:469](https://github.com/Xunnamius/projector/blob/75b2ac9b21c6609d9b8cc2f9871d2d58f0db3dfa/packages/graph/src/analysis/gather-project-files.ts#L469)

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
