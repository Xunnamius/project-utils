[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / gatherPseudodecoratorEntriesFromFilesOptions

# Type Alias: gatherPseudodecoratorEntriesFromFilesOptions

> **gatherPseudodecoratorEntriesFromFilesOptions**: `object`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.d.ts:123

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
