[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/is-accessible](../README.md) / isAccessible

# Function: isAccessible()

> **isAccessible**(...`args`): `Promise`\<`boolean`\>

Defined in: [packages/fs/src/system/is-accessible.ts:107](https://github.com/Xunnamius/projector/blob/0b2556518d9eedc0d26e5216e2be026aef0660ae/packages/fs/src/system/is-accessible.ts#L107)

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
