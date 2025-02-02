[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [readJsonc](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): `unknown`

Defined in: packages/fs/dist/packages/fs/src/system/read-jsonc.d.ts:69

Synchronously read in and parse the contents of an arbitrary JSONC file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

## Parameters

### arguments\_

...\[`AbsolutePath`, [`ReadJsoncOptions`](../../../type-aliases/ReadJsoncOptions.md)\]

## Returns

`unknown`
