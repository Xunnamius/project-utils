[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/is-accessible](../README.md) / isAccessible

# Function: isAccessible()

> **isAccessible**(...`args`): `Promise`\<`boolean`\>

Defined in: [packages/fs/src/system/is-accessible.ts:107](https://github.com/Xunnamius/projector/blob/1a87550070866e204d98f54387d23c3c57e13502/packages/fs/src/system/is-accessible.ts#L107)

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
