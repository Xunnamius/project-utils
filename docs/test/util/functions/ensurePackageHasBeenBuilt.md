[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / ensurePackageHasBeenBuilt

# Function: ensurePackageHasBeenBuilt()

> **ensurePackageHasBeenBuilt**(`packageRoot`, `packageName`, `packageExports`): `Promise`\<`void`\>

Defined in: node\_modules/@-xun/jest/dist/packages/jest/src/index.d.ts:183

This function will throw if `packageName` (at `packageRoot`) has one or more
inaccessible entry points defined in `packageExports`.

## Parameters

### packageRoot

`AbsolutePath`

### packageName

`undefined` | `string`

### packageExports

`undefined` | `Exports`

## Returns

`Promise`\<`void`\>
