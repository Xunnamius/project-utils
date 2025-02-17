[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-jsonc](../README.md) / readJsonc

# Function: readJsonc()

> **readJsonc**\<`T`\>(...`args`): `Promise`\<`T`\>

Defined in: [packages/fs/src/system/read-jsonc.ts:165](https://github.com/Xunnamius/projector/blob/1a87550070866e204d98f54387d23c3c57e13502/packages/fs/src/system/read-jsonc.ts#L165)

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
