[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [analyzeProjectStructure](../README.md) / sync

# Variable: sync

> `const` **sync**: *typeof* `syncAnalyzeProjectStructure`

Defined in: packages/graph/dist/packages/graph/src/analysis/analyze-project-structure.d.ts:90

Synchronously returns information about the structure of the project at the
current working directory.

Depending on which overload of this function is used, an error may be
thrown upon encountering an unnamed repository.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.
