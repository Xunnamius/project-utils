[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / readJsonc

# Function: readJsonc()

## Call Signature

> **readJsonc**\<`T`\>(`path`, `options`): `Promise`\<`T`\>

Defined in: packages/fs/dist/packages/fs/src/system/read-jsonc.d.ts:52

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

Defined in: packages/fs/dist/packages/fs/src/system/read-jsonc.d.ts:55

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
