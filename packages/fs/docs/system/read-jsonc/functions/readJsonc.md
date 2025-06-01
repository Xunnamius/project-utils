[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-jsonc](../README.md) / readJsonc

# Function: readJsonc()

## Call Signature

> **readJsonc**\<`T`\>(`path`, `options`): `Promise`\<`T`\>

Defined in: [packages/fs/src/system/read-jsonc.ts:173](https://github.com/Xunnamius/projector/blob/046ef48bf5d245c4f1a27d7c884708b74af0a9d1/packages/fs/src/system/read-jsonc.ts#L173)

Asynchronously read in and parse the contents of an arbitrary JSONC file.

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

[`ReadJsoncOptions`](../type-aliases/ReadJsoncOptions.md) & `object`

### Returns

`Promise`\<`T`\>

## Call Signature

> **readJsonc**\<`T`\>(`path`, `options`): `Promise`\<`EmptyObject` \| `T`\>

Defined in: [packages/fs/src/system/read-jsonc.ts:177](https://github.com/Xunnamius/projector/blob/046ef48bf5d245c4f1a27d7c884708b74af0a9d1/packages/fs/src/system/read-jsonc.ts#L177)

Asynchronously read in and parse the contents of an arbitrary JSONC file.

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

[`ReadJsoncOptions`](../type-aliases/ReadJsoncOptions.md)

### Returns

`Promise`\<`EmptyObject` \| `T`\>
