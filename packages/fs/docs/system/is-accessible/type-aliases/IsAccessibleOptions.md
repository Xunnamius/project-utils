[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/is-accessible](../README.md) / IsAccessibleOptions

# Type Alias: IsAccessibleOptions

> **IsAccessibleOptions**: `object`

Defined in: [packages/fs/src/system/is-accessible.ts:18](https://github.com/Xunnamius/projector/blob/1a87550070866e204d98f54387d23c3c57e13502/packages/fs/src/system/is-accessible.ts#L18)

## Type declaration

### fsConstant?

> `optional` **fsConstant**: `number`

The type of access check to perform. Defaults to `fs.constants.R_OK`.

#### See

fs.constants

### useCached

> **useCached**: `boolean`

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache

## See

[isAccessible](../functions/isAccessible.md)
