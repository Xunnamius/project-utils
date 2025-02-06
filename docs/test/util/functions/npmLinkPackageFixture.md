[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / npmLinkPackageFixture

# Function: npmLinkPackageFixture()

> **npmLinkPackageFixture**(): [`NpmLinkPackageFixture`](../type-aliases/NpmLinkPackageFixture.md)

Defined in: node\_modules/@-xun/test-mock-fixture/dist/packages/test-mock-fixture/src/fixtures/npm-link-package.d.ts:48

This fixture is similar to `npmCopyPackage` except it makes a symbolic link
(soft link) in the dummy root directory's `node_modules` subdirectory
pointing to the package under test's `dist/` directory (which is typically
created by `dummyNpmPackage`).

It is very similar to `npm link` but without any of the baggage.

## Returns

[`NpmLinkPackageFixture`](../type-aliases/NpmLinkPackageFixture.md)
