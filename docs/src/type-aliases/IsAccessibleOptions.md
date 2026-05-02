[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / IsAccessibleOptions

# Type Alias: IsAccessibleOptions

> **IsAccessibleOptions** = `object`

Defined in: packages/fs/dist/packages/fs/src/system/is-accessible.d.ts:9

## See

[isAccessible](../functions/isAccessible.md)

## Properties

### fsConstant?

> `optional` **fsConstant?**: `number`

Defined in: packages/fs/dist/packages/fs/src/system/is-accessible.d.ts:15

The type of access check to perform. Defaults to `fs.constants.R_OK`.

#### See

fs.constants

***

### useCached

> **useCached**: `boolean`

Defined in: packages/fs/dist/packages/fs/src/system/is-accessible.d.ts:24

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
