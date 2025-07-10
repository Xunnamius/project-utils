[**@-xun/project-graph**](../../../../../README.md)

***

[@-xun/project-graph](../../../../../README.md) / [analysis/gather-pseudodecorator-entries-from-files](../../../README.md) / [gatherPseudodecoratorEntriesFromFiles](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): [`PseudodecoratorsEntry`](../../../type-aliases/PseudodecoratorsEntry.md)[]

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:290](https://github.com/Xunnamius/projector/blob/b410307fe2da8a8f1d44526700e14694b1e77559/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L290)

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

## Parameters

### arguments\_

...\[`AbsolutePath`[], [`gatherPseudodecoratorEntriesFromFilesOptions`](../../../type-aliases/gatherPseudodecoratorEntriesFromFilesOptions.md)\]

## Returns

[`PseudodecoratorsEntry`](../../../type-aliases/PseudodecoratorsEntry.md)[]
