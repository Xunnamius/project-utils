[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [gatherPseudodecoratorEntriesFromFiles](../README.md) / sync

# Variable: sync

> `const` **sync**: `SyncVersionOf`\<*typeof* [`gatherPseudodecoratorEntriesFromFiles`](../../../functions/gatherPseudodecoratorEntriesFromFiles.md)\>

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.d.ts:167

Accepts zero or more file paths and synchronously returns an array of
[PseudodecoratorsEntry](../../../type-aliases/PseudodecoratorsEntry.md)s each mapping a given file path to an array
of [Pseudodecorator](../../../type-aliases/Pseudodecorator.md)s present in said file.

This function does _not_ rely on Babel or any other parsers and accepts any
file regardless of type or extension.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.
