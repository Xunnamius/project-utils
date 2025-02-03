[**@-xun/project-graph**](../../../../../README.md)

***

[@-xun/project-graph](../../../../../README.md) / [analysis/analyze-project-structure](../../../README.md) / [analyzeProjectStructure](../README.md) / sync

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

> **sync**(`options`): `ProjectMetadata`\<`PackageJson`\>

Defined in: [packages/graph/src/analysis/analyze-project-structure.ts:372](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/analysis/analyze-project-structure.ts#L372)

### Parameters

#### options

##### allowUnnamedPackages

`true`

##### cwd

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
However, each Package instance within the returned results _will_
strictly equal each other, respectively.

**See**

cache

### Returns

`ProjectMetadata`\<`PackageJson`\>

## Call Signature

> **sync**(`options`): `ProjectMetadata`

Defined in: [packages/graph/src/analysis/analyze-project-structure.ts:372](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/analysis/analyze-project-structure.ts#L372)

### Parameters

#### options

##### allowUnnamedPackages

`false`

##### cwd

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
However, each Package instance within the returned results _will_
strictly equal each other, respectively.

**See**

cache

### Returns

`ProjectMetadata`
