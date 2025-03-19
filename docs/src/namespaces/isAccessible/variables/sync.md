[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [isAccessible](../README.md) / sync

# Variable: sync

> `const` **sync**: `SyncVersionOf`\<*typeof* [`isAccessible`](../../../functions/isAccessible.md)\>

Defined in: packages/fs/dist/packages/fs/src/system/is-accessible.d.ts:51

Sugar for the synchronous `access(path, fsConstant)` that returns `true` or
`false` rather than throwing or returning `void`. Also supports `file:///`
  protocol URL paths.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.
