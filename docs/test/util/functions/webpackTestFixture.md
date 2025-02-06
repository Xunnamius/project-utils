[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / webpackTestFixture

# Function: webpackTestFixture()

> **webpackTestFixture**(): [`WebpackTestFixture`](../type-aliases/WebpackTestFixture.md)

Defined in: node\_modules/@-xun/test-mock-fixture/dist/packages/test-mock-fixture/src/fixtures/webpack-test.d.ts:55

This fixture initializes the dummy root directory with an index file under
`src` (described by `initialVirtualFiles`) and then executes Webpack. The
index file should import and test the package under test or otherwise trigger the desired Webpack functionality.

The index file must have a path matching the pattern `src/index${extension}`;
it can have any of the following extensions: `.js`, `.cjs`, `.mjs`, `.jsx`,
`.ts`, `.cts`, `.mts`, `.tsx`.

## Returns

[`WebpackTestFixture`](../type-aliases/WebpackTestFixture.md)
