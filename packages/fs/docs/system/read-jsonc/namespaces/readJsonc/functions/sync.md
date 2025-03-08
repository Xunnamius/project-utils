[**@-xun/project-fs**](../../../../../README.md)

***

[@-xun/project-fs](../../../../../README.md) / [system/read-jsonc](../../../README.md) / [readJsonc](../README.md) / sync

# Function: sync()

## Call Signature

> **sync**\<`T`\>(`path`, `options`): `T`

Defined in: [packages/fs/src/system/read-jsonc.ts:215](https://github.com/Xunnamius/projector/blob/f4ac1fc5dfe0c775c2a6a91230908c438ca26815/packages/fs/src/system/read-jsonc.ts#L215)

Synchronously read in and parse the contents of an arbitrary JSONC file.

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

[`ReadJsoncOptions`](../../../type-aliases/ReadJsoncOptions.md) & `object`

### Returns

`T`

## Call Signature

> **sync**\<`T`\>(`path`, `options`): `EmptyObject` \| `T`

Defined in: [packages/fs/src/system/read-jsonc.ts:215](https://github.com/Xunnamius/projector/blob/f4ac1fc5dfe0c775c2a6a91230908c438ca26815/packages/fs/src/system/read-jsonc.ts#L215)

Synchronously read in and parse the contents of an arbitrary JSONC file.

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

[`ReadJsoncOptions`](../../../type-aliases/ReadJsoncOptions.md)

### Returns

`EmptyObject` \| `T`
