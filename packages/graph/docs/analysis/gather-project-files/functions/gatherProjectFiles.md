[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-project-files](../README.md) / gatherProjectFiles

# Function: gatherProjectFiles()

> **gatherProjectFiles**(...`args`): `Promise`\<[`ProjectFiles`](../../../common/type-aliases/ProjectFiles.md)\>

Defined in: [packages/graph/src/analysis/gather-project-files.ts:465](https://github.com/Xunnamius/projector/blob/e9ee21374a7ed831ce875c6adff409f48ae6e839/packages/graph/src/analysis/gather-project-files.ts#L465)

Asynchronously construct a [ProjectFiles](../../../common/type-aliases/ProjectFiles.md) instance containing absolute
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

...\[`GenericProjectMetadata`, [`GatherProjectFilesOptions`](../type-aliases/GatherProjectFilesOptions.md)\]

## Returns

`Promise`\<[`ProjectFiles`](../../../common/type-aliases/ProjectFiles.md)\>
