[**@-xun/project-fs**](../../../../../README.md)

***

[@-xun/project-fs](../../../../../README.md) / [system/is-accessible](../../../README.md) / [isAccessible](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): `boolean`

Defined in: [packages/fs/src/system/is-accessible.ts:124](https://github.com/Xunnamius/projector/blob/af2aba5aa55ae25931180f8845a9a815a4bb9eeb/packages/fs/src/system/is-accessible.ts#L124)

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
