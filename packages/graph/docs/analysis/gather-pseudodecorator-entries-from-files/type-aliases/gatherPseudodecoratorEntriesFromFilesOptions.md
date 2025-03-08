[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-pseudodecorator-entries-from-files](../README.md) / gatherPseudodecoratorEntriesFromFilesOptions

# Type Alias: gatherPseudodecoratorEntriesFromFilesOptions

> **gatherPseudodecoratorEntriesFromFilesOptions**: `object`

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:149](https://github.com/Xunnamius/projector/blob/75b2ac9b21c6609d9b8cc2f9871d2d58f0db3dfa/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L149)

## Type declaration

### useCached

> **useCached**: `boolean`

Use the internal cached result from a previous run, if available.

**WARNING: the results returned by this function, while functionally
identical to each other, will _NOT_ strictly equal (`===`) each other.**
However, each [PseudodecoratorsEntry](PseudodecoratorsEntry.md) tuple within the returned
results _will_ strictly equal each other, respectively.

#### See

cache

## See

[gatherPseudodecoratorEntriesFromFiles](../functions/gatherPseudodecoratorEntriesFromFiles.md)
