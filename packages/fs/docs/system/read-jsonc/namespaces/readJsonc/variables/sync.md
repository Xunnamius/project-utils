[**@-xun/project-fs**](../../../../../README.md)

***

[@-xun/project-fs](../../../../../README.md) / [system/read-jsonc](../../../README.md) / [readJsonc](../README.md) / sync

# Variable: sync()

> `const` **sync**: \{\<`T`\>(`path`, `options`): `T`; \<`T`\>(`path`, `options`): `EmptyObject` \| `T`; \} = `readJsoncSync`

Defined in: [packages/fs/src/system/read-jsonc.ts:215](https://github.com/Xunnamius/projector/blob/5b7550c9164a11cdadffbed45b8561eafc585ead/packages/fs/src/system/read-jsonc.ts#L215)

## Call Signature

> \<`T`\>(`path`, `options`): `T`

Synchronously read in and parse the contents of an arbitrary JSONC file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

### Type Parameters

#### T

`T` = `JsonValue`

### Parameters

#### path

`AbsolutePath`

#### options

[`ReadJsoncOptions`](../../../type-aliases/ReadJsoncOptions.md) & `object`

### Returns

`T`

## Call Signature

> \<`T`\>(`path`, `options`): `EmptyObject` \| `T`

Synchronously read in and parse the contents of an arbitrary JSONC file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

### Type Parameters

#### T

`T` = `JsonValue`

### Parameters

#### path

`AbsolutePath`

#### options

[`ReadJsoncOptions`](../../../type-aliases/ReadJsoncOptions.md)

### Returns

`EmptyObject` \| `T`
