[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/analyze-project-structure](../README.md) / AnalyzeProjectStructureOptions

# Type Alias: AnalyzeProjectStructureOptions

> **AnalyzeProjectStructureOptions**: `object`

Defined in: [packages/graph/src/analysis/analyze-project-structure.ts:77](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/analysis/analyze-project-structure.ts#L77)

## Type declaration

### allowUnnamedPackages?

> `optional` **allowUnnamedPackages**: `boolean`

Allow unnamed packages in this project, which will result in looser and
less useful types being returned. Setting this to `true` is only useful
when analyzing projects that do not adhere to standard symbiote (or
NPM/Node) best practices.

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
