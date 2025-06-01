[**@-xun/project-fs**](../../../../../README.md)

***

[@-xun/project-fs](../../../../../README.md) / [system/read-json](../../../README.md) / [readJson](../README.md) / sync

# Variable: sync()

> `const` **sync**: \{\<`T`\>(`path`, `options`): `T`; \<`T`\>(`path`, `options`): `EmptyObject` \| `T`; \} = `readJsonSync`

Defined in: [packages/fs/src/system/read-json.ts:181](https://github.com/Xunnamius/projector/blob/046ef48bf5d245c4f1a27d7c884708b74af0a9d1/packages/fs/src/system/read-json.ts#L181)

## Call Signature

> \<`T`\>(`path`, `options`): `T`

Synchronously read in and parse the contents of an arbitrary JSON file.

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

[`ReadJsonOptions`](../../../type-aliases/ReadJsonOptions.md) & `object`

### Returns

`T`

## Call Signature

> \<`T`\>(`path`, `options`): `EmptyObject` \| `T`

Synchronously read in and parse the contents of an arbitrary JSON file.

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

[`ReadJsonOptions`](../../../type-aliases/ReadJsonOptions.md)

### Returns

`EmptyObject` \| `T`
