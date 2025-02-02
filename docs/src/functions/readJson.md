[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / readJson

# Function: readJson()

> **readJson**\<`T`\>(...`args`): `Promise`\<`T`\>

Defined in: packages/fs/dist/packages/fs/src/system/read-json.d.ts:41

Asynchronously read in and parse the contents of an arbitrary JSON file.

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

...\[`AbsolutePath`, [`ReadJsonOptions`](../type-aliases/ReadJsonOptions.md)\]

## Returns

`Promise`\<`T`\>
