[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-pseudodecorator-entries-from-files](../README.md) / gatherPseudodecoratorEntriesFromFiles

# Function: gatherPseudodecoratorEntriesFromFiles()

> **gatherPseudodecoratorEntriesFromFiles**(...`args`): `Promise`\<[`PseudodecoratorsEntry`](../type-aliases/PseudodecoratorsEntry.md)[]\>

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:268](https://github.com/Xunnamius/projector/blob/5f5f92eca551ebad2a8ed7123cb7ab801a86ad67/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L268)

Accepts zero or more file paths and asynchronously returns an array of
[PseudodecoratorsEntry](../type-aliases/PseudodecoratorsEntry.md)s each mapping a given file path to an array of
[Pseudodecorator](../type-aliases/Pseudodecorator.md)s present in said file.

This function does _not_ rely on Babel or any other parsers and accepts any
file regardless of type or extension.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Parameters

### args

...\[`AbsolutePath`[], [`gatherPseudodecoratorEntriesFromFilesOptions`](../type-aliases/gatherPseudodecoratorEntriesFromFilesOptions.md)\]

## Returns

`Promise`\<[`PseudodecoratorsEntry`](../type-aliases/PseudodecoratorsEntry.md)[]\>
