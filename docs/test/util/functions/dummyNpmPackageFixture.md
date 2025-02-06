[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / dummyNpmPackageFixture

# Function: dummyNpmPackageFixture()

> **dummyNpmPackageFixture**(): [`DummyNpmPackageFixture`](../type-aliases/DummyNpmPackageFixture.md)

Defined in: node\_modules/@-xun/test-mock-fixture/dist/packages/test-mock-fixture/src/fixtures/dummy-npm-package.d.ts:49

This fixture initializes the dummy root directory as a NPM package with a
package.json file (optionally described by `initialVirtualFiles`) and
node_modules subdirectory.

If a `packageUnderTest` is provided, and it is namespaced (e.g.
"@-xun/symbiote"), an empty directory will be created using the namespace as
its name (e.g. `node_modules/@-xun`).

## Returns

[`DummyNpmPackageFixture`](../type-aliases/DummyNpmPackageFixture.md)
