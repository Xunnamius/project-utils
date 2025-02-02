[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / gatherProjectFiles

# Function: gatherProjectFiles()

> **gatherProjectFiles**(...`args`): `Promise`\<[`ProjectFiles`](../type-aliases/ProjectFiles.md)\>

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-project-files.d.ts:61

Asynchronously construct a [ProjectFiles](../type-aliases/ProjectFiles.md) instance containing absolute
file paths (AbsolutePaths) derived from `projectMetadata`.

Note that **only named packages** are considered "packages" in monorepos.
Unnamed and broken packages/workspaces are ignored except when constructing
`packageJsonFiles.elsewhere`.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Parameters

### args

...\[[`GenericProjectMetadata`](../type-aliases/GenericProjectMetadata.md), [`GatherProjectFilesOptions`](../type-aliases/GatherProjectFilesOptions.md)\]

## Returns

`Promise`\<[`ProjectFiles`](../type-aliases/ProjectFiles.md)\>
