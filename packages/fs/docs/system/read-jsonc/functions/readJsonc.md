[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-jsonc](../README.md) / readJsonc

# Function: readJsonc()

> **readJsonc**\<`T`\>(...`args`): `Promise`\<`T`\>

Defined in: [packages/fs/src/system/read-jsonc.ts:165](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/fs/src/system/read-jsonc.ts#L165)

Asynchronously read in and parse the contents of an arbitrary JSONC file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Type Parameters

• **T** = `JsonValue`

## Parameters

### args

...\[`AbsolutePath`, [`ReadJsoncOptions`](../type-aliases/ReadJsoncOptions.md)\]

## Returns

`Promise`\<`T`\>
