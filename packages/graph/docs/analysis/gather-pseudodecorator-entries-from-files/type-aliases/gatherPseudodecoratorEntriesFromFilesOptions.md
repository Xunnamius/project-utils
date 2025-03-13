[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-pseudodecorator-entries-from-files](../README.md) / gatherPseudodecoratorEntriesFromFilesOptions

# Type Alias: gatherPseudodecoratorEntriesFromFilesOptions

> **gatherPseudodecoratorEntriesFromFilesOptions**: `object`

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:149](https://github.com/Xunnamius/projector/blob/b164ec02958be4a3fc50929ad4f824678a7453d6/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L149)

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
