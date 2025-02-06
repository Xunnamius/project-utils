[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / NpmCopyPackageFixtureOptions

# Type Alias: NpmCopyPackageFixtureOptions

> **NpmCopyPackageFixtureOptions**: `Tagged`\<`object` & `Pick`\<[`NodeImportAndRunTestFixtureOptions`](NodeImportAndRunTestFixtureOptions.md), `"npmInstall"` \| `"runInstallScripts"`\>, *typeof* [`npmCopyPackageFixtureName`](../variables/npmCopyPackageFixtureName.md)\>

Defined in: node\_modules/@-xun/test-mock-fixture/dist/packages/test-mock-fixture/src/fixtures/npm-copy-package.d.ts:21

Contains any additional options properties this fixture expects or allows.

This type is Tagged so that it can be differentiated from `XContext`
types provided by other fixtures, even when they contain the same keys (or no
keys).

## See

[npmCopyPackageFixture](../functions/npmCopyPackageFixture.md)
