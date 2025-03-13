[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/analyze-project-structure](../README.md) / AnalyzeProjectStructureOptions

# Type Alias: AnalyzeProjectStructureOptions

> **AnalyzeProjectStructureOptions**: `object`

Defined in: [packages/graph/src/analysis/analyze-project-structure.ts:73](https://github.com/Xunnamius/projector/blob/b164ec02958be4a3fc50929ad4f824678a7453d6/packages/graph/src/analysis/analyze-project-structure.ts#L73)

## Type declaration

### allowUnnamedPackages?

> `optional` **allowUnnamedPackages**: `boolean`

Allow unnamed packages in this project, which will result in looser and
less useful types in the returned ProjectMetadata object. Setting
this to `true` is only useful when analyzing projects that do not adhere to
standard symbiote (or npm/node) best practices.

When this option is `false`, unnamed sub-root packages will be considered
"broken," and an unnamed `rootPackage`/`cwdPackage` will throw an error;
broken packages will be available under
`ProjectMetadata.subRootPackages.broken`.

When `true`, unnamed packages will be available under
`ProjectMetadata.subRootPackages.unnamed` and `rootPackage`/`cwdPackage`
can be unnamed.

Unnamed packages are _never_ included in the
ProjectMetadata.subRootPackages map itself regardless of this
option.

#### Default

```ts
false
```

### cwd?

> `optional` **cwd**: `AbsolutePath`

The current working directory as an absolute path.

#### Default

```ts
process.cwd()
```

### useCached

> **useCached**: `boolean`

Use the internal cached result from a previous run, if available.

**WARNING: the results returned by this function, while functionally
identical to each other, will _NOT_ strictly equal (`===`) each other.**
However, each Package instance within the returned results _will_
strictly equal each other, respectively.

#### See

cache

## See

[analyzeProjectStructure](../functions/analyzeProjectStructure.md)
