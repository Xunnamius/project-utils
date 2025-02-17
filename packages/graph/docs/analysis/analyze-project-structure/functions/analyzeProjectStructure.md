[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/analyze-project-structure](../README.md) / analyzeProjectStructure

# Function: analyzeProjectStructure()

## Call Signature

> **analyzeProjectStructure**(`options`): `Promise`\<`ProjectMetadata`\>

Defined in: [packages/graph/src/analysis/analyze-project-structure.ts:328](https://github.com/Xunnamius/projector/blob/ea32adc50974a6b6b82e71ee97678647e4be8f84/packages/graph/src/analysis/analyze-project-structure.ts#L328)

Asynchronously returns information about the structure of the project at the
current working directory.

This function will throw upon encountering an unnamed repository.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

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
However, each Package instance within the returned results _will_
strictly equal each other, respectively.

**See**

cache

### Returns

`Promise`\<`ProjectMetadata`\>

## Call Signature

> **analyzeProjectStructure**(`options`): `Promise`\<`ProjectMetadata`\<`PackageJson`\>\>

Defined in: [packages/graph/src/analysis/analyze-project-structure.ts:342](https://github.com/Xunnamius/projector/blob/ea32adc50974a6b6b82e71ee97678647e4be8f84/packages/graph/src/analysis/analyze-project-structure.ts#L342)

Asynchronously returns information about the structure of the project at the
current working directory.

This function will NOT throw upon encountering an unnamed repository.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

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
However, each Package instance within the returned results _will_
strictly equal each other, respectively.

**See**

cache

### Returns

`Promise`\<`ProjectMetadata`\<`PackageJson`\>\>
