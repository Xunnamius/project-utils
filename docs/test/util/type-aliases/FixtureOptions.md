[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / FixtureOptions

# Type Alias: FixtureOptions\<T\>

> **FixtureOptions**\<`T`\>: [`GlobalFixtureOptions`](GlobalFixtureOptions.md) & `T` *extends* [`DescribeRootFixture`](DescribeRootFixture.md) ? [`DescribeRootFixtureOptions`](DescribeRootFixtureOptions.md) : `unknown` & `T` *extends* [`DummyDirectoriesFixture`](DummyDirectoriesFixture.md) ? [`DummyDirectoriesFixtureOptions`](DummyDirectoriesFixtureOptions.md) : `unknown` & `T` *extends* [`DummyFilesFixture`](DummyFilesFixture.md) ? [`DummyFilesFixtureOptions`](DummyFilesFixtureOptions.md) : `unknown` & `T` *extends* [`DummyNpmPackageFixture`](DummyNpmPackageFixture.md) ? [`DummyNpmPackageFixtureOptions`](DummyNpmPackageFixtureOptions.md) : `unknown` & `T` *extends* [`GitRepositoryFixture`](GitRepositoryFixture.md) ? [`GitRepositoryFixtureOptions`](GitRepositoryFixtureOptions.md) : `unknown` & `T` *extends* [`NodeImportAndRunTestFixture`](NodeImportAndRunTestFixture.md) ? [`NodeImportAndRunTestFixtureOptions`](NodeImportAndRunTestFixtureOptions.md) : `unknown` & `T` *extends* [`RunTestFixture`](RunTestFixture.md) ? [`RunTestFixtureOptions`](RunTestFixtureOptions.md) : `unknown` & `T` *extends* [`NpmCopyPackageFixture`](NpmCopyPackageFixture.md) ? [`NpmCopyPackageFixtureOptions`](NpmCopyPackageFixtureOptions.md) : `unknown` & `T` *extends* [`NpmLinkPackageFixture`](NpmLinkPackageFixture.md) ? [`NpmLinkPackageFixtureOptions`](NpmLinkPackageFixtureOptions.md) : `unknown` & `T` *extends* [`WebpackTestFixture`](WebpackTestFixture.md) ? [`WebpackTestFixtureOptions`](WebpackTestFixtureOptions.md) : `unknown`

Defined in: node\_modules/@-xun/test-mock-fixture/dist/packages/test-mock-fixture/src/types/options.d.ts:58

This type combines all possible configurable options conditioned on which
fixtures are actually used.

## Type Parameters

• **T** *extends* [`GenericMockFixture`](GenericMockFixture.md)
