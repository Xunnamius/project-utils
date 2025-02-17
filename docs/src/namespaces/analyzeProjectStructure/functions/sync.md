[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [analyzeProjectStructure](../README.md) / sync

# Function: sync()

Synchronously returns information about the structure of the project at the
current working directory.

Depending on which overload of this function is used, an error may be
thrown upon encountering an unnamed repository.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

## Call Signature

> **sync**(`options`): [`ProjectMetadata`](../../../type-aliases/ProjectMetadata.md)\<`PackageJson`\>

Defined in: packages/graph/dist/packages/graph/src/analysis/analyze-project-structure.d.ts:77

### Parameters

#### options

##### allowUnnamedPackages

`true`

##### cwd?

`AbsolutePath`

The current working directory as an absolute path.

**Default**

```ts
process.cwd()
```

##### useCached

`boolean`

Use the internal cached result from a previous run, if available.

**WARNING: the results returned by this function, while functionally
identical to each other, will _NOT_ strictly equal (`===`) each other.**
However, each [Package](../../../type-aliases/Package.md) instance within the returned results _will_
strictly equal each other, respectively.

**See**

cache

### Returns

[`ProjectMetadata`](../../../type-aliases/ProjectMetadata.md)\<`PackageJson`\>

## Call Signature

> **sync**(`options`): [`ProjectMetadata`](../../../type-aliases/ProjectMetadata.md)

Defined in: packages/graph/dist/packages/graph/src/analysis/analyze-project-structure.d.ts:77

### Parameters

#### options

##### allowUnnamedPackages?

`false`

##### cwd?

`AbsolutePath`

The current working directory as an absolute path.

**Default**

```ts
process.cwd()
```

##### useCached

`boolean`

Use the internal cached result from a previous run, if available.

**WARNING: the results returned by this function, while functionally
identical to each other, will _NOT_ strictly equal (`===`) each other.**
However, each [Package](../../../type-aliases/Package.md) instance within the returned results _will_
strictly equal each other, respectively.

**See**

cache

### Returns

[`ProjectMetadata`](../../../type-aliases/ProjectMetadata.md)
