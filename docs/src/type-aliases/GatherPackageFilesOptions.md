[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / GatherPackageFilesOptions

# Type Alias: GatherPackageFilesOptions

> **GatherPackageFilesOptions** = `object`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-files.d.ts:8

## See

[gatherPackageFiles](../functions/gatherPackageFiles.md)

## Properties

### ignore?

> `optional` **ignore?**: (`string` \| `RelativePath`)[]

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-files.d.ts:35

Exclude paths from the result with respect to the given patterns, which are
interpreted **relative to the _project root_** according to gitignore
rules.

This option can also be used together with
[GatherPackageFilesOptions.skipGitIgnored](#skipgitignored). Also, since `ignore` is
appended to the final list of ignored files, negated globs can be used to
un-ignore files.

***

### skipGitIgnored?

> `optional` **skipGitIgnored?**: `boolean`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-files.d.ts:24

If `true`, use the project root's `.gitignore` file exclusively to filter
out returned project files.

#### Default

```ts
true
```

***

### useCached

> **useCached**: `boolean`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-files.d.ts:17

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
