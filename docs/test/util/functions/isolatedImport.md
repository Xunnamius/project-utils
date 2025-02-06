[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / isolatedImport

# Function: isolatedImport()

> **isolatedImport**\<`T`\>(`path`, `options`?): `T`

Defined in: node\_modules/@-xun/test-mock-import/dist/packages/test-mock-import/src/index.d.ts:24

Performs a module import as if it were being imported for the first time.

Note that this function breaks the "require caching" expectation of Node.js
modules. Problems can arise, for example, when closing an app-wide database
connection in your test cleanup phase and expecting it to close for the
isolated module too. In this case, the isolated module has its own isolated
"app-wide" connection that would not actually be closed and could cause your
test to hang unexpectedly, even when all tests pass.

## Type Parameters

• **T**

## Parameters

### path

`string`

Path to the module to import. Module resolution is handled by `require`.

### options?

[`IsolatedImportOptions`](../type-aliases/IsolatedImportOptions.md)

## Returns

`T`
