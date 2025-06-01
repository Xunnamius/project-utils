[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-package-files](../README.md) / GatherPackageFilesOptions

# Type Alias: GatherPackageFilesOptions

> **GatherPackageFilesOptions** = `object`

Defined in: [packages/graph/src/analysis/gather-package-files.ts:27](https://github.com/Xunnamius/projector/blob/9c68f75450e3c8cd36c484a1863f7d61992f83cc/packages/graph/src/analysis/gather-package-files.ts#L27)

## See

[gatherPackageFiles](../functions/gatherPackageFiles.md)

## Properties

### ignore?

> `optional` **ignore**: (`string` \| `RelativePath`)[]

Defined in: [packages/graph/src/analysis/gather-package-files.ts:54](https://github.com/Xunnamius/projector/blob/9c68f75450e3c8cd36c484a1863f7d61992f83cc/packages/graph/src/analysis/gather-package-files.ts#L54)

Exclude paths from the result with respect to the given patterns, which are
interpreted **relative to the _project root_** according to gitignore
rules.

This option can also be used together with
[GatherPackageFilesOptions.skipGitIgnored](#skipgitignored). Also, since `ignore` is
appended to the final list of ignored files, negated globs can be used to
un-ignore files.

***

### skipGitIgnored?

> `optional` **skipGitIgnored**: `boolean`

Defined in: [packages/graph/src/analysis/gather-package-files.ts:43](https://github.com/Xunnamius/projector/blob/9c68f75450e3c8cd36c484a1863f7d61992f83cc/packages/graph/src/analysis/gather-package-files.ts#L43)

If `true`, use the project root's `.gitignore` file exclusively to filter
out returned project files.

#### Default

```ts
true
```

***

### useCached

> **useCached**: `boolean`

Defined in: [packages/graph/src/analysis/gather-package-files.ts:36](https://github.com/Xunnamius/projector/blob/9c68f75450e3c8cd36c484a1863f7d61992f83cc/packages/graph/src/analysis/gather-package-files.ts#L36)

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
