[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/is-accessible](../README.md) / IsAccessibleOptions

# Type Alias: IsAccessibleOptions

> **IsAccessibleOptions**: `object`

Defined in: [packages/fs/src/system/is-accessible.ts:18](https://github.com/Xunnamius/projector/blob/124f6e6b6e700d669a6e7832c4ad15585be7dc80/packages/fs/src/system/is-accessible.ts#L18)

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
