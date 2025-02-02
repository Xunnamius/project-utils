[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / IsAccessibleOptions

# Type Alias: IsAccessibleOptions

> **IsAccessibleOptions**: `object`

Defined in: packages/fs/dist/packages/fs/src/system/is-accessible.d.ts:9

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
