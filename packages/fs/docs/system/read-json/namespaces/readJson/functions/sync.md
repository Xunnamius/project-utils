[**@-xun/project-fs**](../../../../../README.md)

***

[@-xun/project-fs](../../../../../README.md) / [system/read-json](../../../README.md) / [readJson](../README.md) / sync

# Function: sync()

## Call Signature

> **sync**\<`T`\>(`path`, `options`): `T`

Defined in: [packages/fs/src/system/read-json.ts:181](https://github.com/Xunnamius/projector/blob/0b2556518d9eedc0d26e5216e2be026aef0660ae/packages/fs/src/system/read-json.ts#L181)

Synchronously read in and parse the contents of an arbitrary JSON file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

### Type Parameters

• **T** = `JsonValue`

### Parameters

#### path

`AbsolutePath`

#### options

[`ReadJsonOptions`](../../../type-aliases/ReadJsonOptions.md) & `object`

### Returns

`T`

## Call Signature

> **sync**\<`T`\>(`path`, `options`): `EmptyObject` \| `T`

Defined in: [packages/fs/src/system/read-json.ts:181](https://github.com/Xunnamius/projector/blob/0b2556518d9eedc0d26e5216e2be026aef0660ae/packages/fs/src/system/read-json.ts#L181)

Synchronously read in and parse the contents of an arbitrary JSON file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

### Type Parameters

• **T** = `JsonValue`

### Parameters

#### path

`AbsolutePath`

#### options

[`ReadJsonOptions`](../../../type-aliases/ReadJsonOptions.md)

### Returns

`EmptyObject` \| `T`
