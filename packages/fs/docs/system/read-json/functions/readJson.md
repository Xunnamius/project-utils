[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-json](../README.md) / readJson

# Function: readJson()

## Call Signature

> **readJson**\<`T`\>(`path`, `options`): `Promise`\<`T`\>

Defined in: [packages/fs/src/system/read-json.ts:141](https://github.com/Xunnamius/projector/blob/af2aba5aa55ae25931180f8845a9a815a4bb9eeb/packages/fs/src/system/read-json.ts#L141)

Asynchronously read in and parse the contents of an arbitrary JSON file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

### Type Parameters

• **T** = `JsonValue`

### Parameters

#### path

`AbsolutePath`

#### options

[`ReadJsonOptions`](../type-aliases/ReadJsonOptions.md) & `object`

### Returns

`Promise`\<`T`\>

## Call Signature

> **readJson**\<`T`\>(`path`, `options`): `Promise`\<`T` \| `EmptyObject`\>

Defined in: [packages/fs/src/system/read-json.ts:145](https://github.com/Xunnamius/projector/blob/af2aba5aa55ae25931180f8845a9a815a4bb9eeb/packages/fs/src/system/read-json.ts#L145)

Asynchronously read in and parse the contents of an arbitrary JSON file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

### Type Parameters

• **T** = `JsonValue`

### Parameters

#### path

`AbsolutePath`

#### options

[`ReadJsonOptions`](../type-aliases/ReadJsonOptions.md)

### Returns

`Promise`\<`T` \| `EmptyObject`\>
