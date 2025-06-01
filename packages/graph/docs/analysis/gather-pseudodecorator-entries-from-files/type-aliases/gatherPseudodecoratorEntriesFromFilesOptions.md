[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-pseudodecorator-entries-from-files](../README.md) / gatherPseudodecoratorEntriesFromFilesOptions

# Type Alias: gatherPseudodecoratorEntriesFromFilesOptions

> **gatherPseudodecoratorEntriesFromFilesOptions** = `object`

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:149](https://github.com/Xunnamius/projector/blob/7607517f14ad401cf959467e106fee9dead50bb3/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L149)

## See

[gatherPseudodecoratorEntriesFromFiles](../functions/gatherPseudodecoratorEntriesFromFiles.md)

## Properties

### useCached

> **useCached**: `boolean`

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:160](https://github.com/Xunnamius/projector/blob/7607517f14ad401cf959467e106fee9dead50bb3/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L160)

Use the internal cached result from a previous run, if available.

**WARNING: the results returned by this function, while functionally
identical to each other, will _NOT_ strictly equal (`===`) each other.**
However, each [PseudodecoratorsEntry](PseudodecoratorsEntry.md) tuple within the returned
results _will_ strictly equal each other, respectively.

#### See

cache
