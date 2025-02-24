[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-package-files](../README.md) / GatherPackageFilesOptions

# Type Alias: GatherPackageFilesOptions

> **GatherPackageFilesOptions**: `object`

Defined in: [packages/graph/src/analysis/gather-package-files.ts:27](https://github.com/Xunnamius/projector/blob/7505ea44374986d1d0ddf3a37cdd5d3729450f39/packages/graph/src/analysis/gather-package-files.ts#L27)

## Type declaration

### ignore?

> `optional` **ignore**: (`string` \| `RelativePath`)[]

Exclude paths from the result with respect to the given patterns, which are
interpreted **relative to the _project root_** according to gitignore
rules.

This option can also be used together with
[GatherPackageFilesOptions.skipGitIgnored](GatherPackageFilesOptions.md#skipgitignored). Also, since `ignore` is
appended to the final list of ignored files, negated globs can be used to
un-ignore files.

### skipGitIgnored?

> `optional` **skipGitIgnored**: `boolean`

If `true`, use the project root's `.gitignore` file exclusively to filter
out returned project files.

#### Default

```ts
true
```

### useCached

> **useCached**: `boolean`

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache

## See

[gatherPackageFiles](../functions/gatherPackageFiles.md)
