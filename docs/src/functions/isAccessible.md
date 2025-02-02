[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / isAccessible

# Function: isAccessible()

> **isAccessible**(...`args`): `Promise`\<`boolean`\>

Defined in: packages/fs/dist/packages/fs/src/system/is-accessible.d.ts:38

Sugar for asynchronous `access(path, fsConstant)` that returns `true` or
`false` rather than rejecting or resolving to `undefined`. Also supports
`file:///` protocol URL paths.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Parameters

### args

...\[`string`, [`IsAccessibleOptions`](../type-aliases/IsAccessibleOptions.md)\]

## Returns

`Promise`\<`boolean`\>
