[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/is-accessible](../README.md) / IsAccessibleOptions

# Type Alias: IsAccessibleOptions

> **IsAccessibleOptions** = `object`

Defined in: [packages/fs/src/system/is-accessible.ts:18](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/is-accessible.ts#L18)

## See

[isAccessible](../functions/isAccessible.md)

## Properties

### fsConstant?

> `optional` **fsConstant**: `number`

Defined in: [packages/fs/src/system/is-accessible.ts:24](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/is-accessible.ts#L24)

The type of access check to perform. Defaults to `fs.constants.R_OK`.

#### See

fs.constants

***

### useCached

> **useCached**: `boolean`

Defined in: [packages/fs/src/system/is-accessible.ts:33](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/is-accessible.ts#L33)

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
