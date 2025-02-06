[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / npmCopyPackageFixture

# Function: npmCopyPackageFixture()

> **npmCopyPackageFixture**(): [`NpmCopyPackageFixture`](../type-aliases/NpmCopyPackageFixture.md)

Defined in: node\_modules/@-xun/test-mock-fixture/dist/packages/test-mock-fixture/src/fixtures/npm-copy-package.d.ts:98

This fixture is similar to `npmLinkPackage` except it copies all of the
distributables, identified by the package under test's `package.json` `files`
field, into the dummy `node_modules` directory created by a fixture like
`dummyNpmPackage`.

## Returns

[`NpmCopyPackageFixture`](../type-aliases/NpmCopyPackageFixture.md)
