[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-json](../README.md) / readJson

# Function: readJson()

## Call Signature

> **readJson**\<`T`\>(`path`, `options`): `Promise`\<`T`\>

Defined in: [packages/fs/src/system/read-json.ts:141](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/read-json.ts#L141)

Asynchronously read in and parse the contents of an arbitrary JSON file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

### Type Parameters

#### T

`T` = `JsonValue`

### Parameters

#### path

`AbsolutePath`

#### options

[`ReadJsonOptions`](../type-aliases/ReadJsonOptions.md) & `object`

### Returns

`Promise`\<`T`\>

## Call Signature

> **readJson**\<`T`\>(`path`, `options`): `Promise`\<`T` \| `EmptyObject`\>

Defined in: [packages/fs/src/system/read-json.ts:145](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/read-json.ts#L145)

Asynchronously read in and parse the contents of an arbitrary JSON file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

### Type Parameters

#### T

`T` = `JsonValue`

### Parameters

#### path

`AbsolutePath`

#### options

[`ReadJsonOptions`](../type-aliases/ReadJsonOptions.md)

### Returns

`Promise`\<`T` \| `EmptyObject`\>
