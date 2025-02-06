[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / protectedImportFactory

# Function: protectedImportFactory()

> **protectedImportFactory**\<`T`\>(`path`): (`factoryOptions`?) => `Promise`\<`T`\>

Defined in: node\_modules/@-xun/test-mock-import/dist/packages/test-mock-import/src/index.d.ts:38

Returns a function that, when invoked, performs a module import as if it were
being imported for the first time.

Use `expectedExitCode` when the import is expected to terminate with a
specific exit code.

## Type Parameters

• **T**

## Parameters

### path

`string`

## Returns

`Function`

### Parameters

#### factoryOptions?

##### expectedExitCode

`number`

### Returns

`Promise`\<`T`\>

## See

[isolatedImport](isolatedImport.md)
