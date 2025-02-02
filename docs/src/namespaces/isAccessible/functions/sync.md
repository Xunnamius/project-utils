[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [isAccessible](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): `boolean`

Defined in: packages/fs/dist/packages/fs/src/system/is-accessible.d.ts:51

Sugar for the synchronous `access(path, fsConstant)` that returns `true` or
`false` rather than throwing or returning `void`. Also supports `file:///`
  protocol URL paths.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

## Parameters

### arguments\_

...\[`string`, [`IsAccessibleOptions`](../../../type-aliases/IsAccessibleOptions.md)\]

## Returns

`boolean`
