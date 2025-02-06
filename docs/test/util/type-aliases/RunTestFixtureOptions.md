[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / RunTestFixtureOptions

# Type Alias: RunTestFixtureOptions

> **RunTestFixtureOptions**: `Tagged`\<`RequiredDeep`\<`Pick`\<[`NodeImportAndRunTestFixtureOptions`](NodeImportAndRunTestFixtureOptions.md), `"runWith"`\>\>, *typeof* [`runTestFixtureName`](../variables/runTestFixtureName.md)\>

Defined in: node\_modules/@-xun/test-mock-fixture/dist/packages/test-mock-fixture/src/fixtures/run-test.d.ts:21

Contains any additional options properties this fixture expects or allows.

This type is Tagged so that it can be differentiated from `XContext`
types provided by other fixtures, even when they contain the same keys (or no
keys).

## See

[runTestFixture](../functions/runTestFixture.md)
