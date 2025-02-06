[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / FixtureContext

# Type Alias: FixtureContext\<Options\>

> **FixtureContext**\<`Options`\>: `object` & `Options` *extends* [`DescribeRootFixtureOptions`](DescribeRootFixtureOptions.md) ? [`DescribeRootFixtureContext`](DescribeRootFixtureContext.md) : `unknown` & `Options` *extends* [`DummyDirectoriesFixtureOptions`](DummyDirectoriesFixtureOptions.md) ? [`DummyDirectoriesFixtureContext`](DummyDirectoriesFixtureContext.md) : `unknown` & `Options` *extends* [`DummyFilesFixtureOptions`](DummyFilesFixtureOptions.md) ? [`DummyFilesFixtureContext`](DummyFilesFixtureContext.md) : `unknown` & `Options` *extends* [`DummyNpmPackageFixtureOptions`](DummyNpmPackageFixtureOptions.md) ? [`DummyNpmPackageFixtureContext`](DummyNpmPackageFixtureContext.md) : `unknown` & `Options` *extends* [`GitRepositoryFixtureOptions`](GitRepositoryFixtureOptions.md) ? [`GitRepositoryFixtureContext`](GitRepositoryFixtureContext.md) : `unknown` & `Options` *extends* [`NodeImportAndRunTestFixtureOptions`](NodeImportAndRunTestFixtureOptions.md) ? [`NodeImportAndRunTestFixtureContext`](NodeImportAndRunTestFixtureContext.md) : `unknown` & `Options` *extends* [`RunTestFixtureOptions`](RunTestFixtureOptions.md) ? [`RunTestFixtureContext`](RunTestFixtureContext.md) : `unknown` & `Options` *extends* [`NpmCopyPackageFixtureOptions`](NpmCopyPackageFixtureOptions.md) ? [`NpmCopyPackageFixtureContext`](NpmCopyPackageFixtureContext.md) : `unknown` & `Options` *extends* [`NpmLinkPackageFixtureOptions`](NpmLinkPackageFixtureOptions.md) ? [`NpmLinkPackageFixtureContext`](NpmLinkPackageFixtureContext.md) : `unknown` & `Options` *extends* [`WebpackTestFixtureOptions`](WebpackTestFixtureOptions.md) ? [`WebpackTestFixtureContext`](WebpackTestFixtureContext.md) : `unknown`

Defined in: node\_modules/@-xun/test-mock-fixture/dist/packages/test-mock-fixture/src/types/fixtures.d.ts:72

The context object passed around between every [MockFixture](MockFixture.md).

## Type declaration

### debug

> **debug**: `ExtendedDebugger`

An ExtendedDebugger instance extended specifically for use by the
current fixture.

### fixtures

> **fixtures**: [`GenericMockFixture`](GenericMockFixture.md)[]

The fixtures that comprise the current runtime.

### fs

> **fs**: [`FixtureFs`](FixtureFs.md)

Context-sensitive asynchronous wrappers for `node:fs/promises` functions
(excluding FixtureFs.glob) with in-build debugging and exception
handling.

Note that all relative `PathLike` parameters are considered local to
`root`, not the current working directory, and will be translated into
AbsolutePaths as such.

### options

> **options**: `ReadonlyDeep`\<[`GlobalFixtureOptions`](GlobalFixtureOptions.md) & `Options`\>

The options applicable to the current runtime.

### root

> **root**: `AbsolutePath`

The AbsolutePath pointing to the dummy root directory.

### virtualFiles

> **virtualFiles**: `object`

The mutable "virtual files" as they exist currently in memory, including
any mutations performed by fixtures.

#### Index Signature

\[`filePath`: `RelativePath`\]: `string`

#### See

[GlobalFixtureOptions.initialVirtualFiles](GlobalFixtureOptions.md#initialvirtualfiles)

## Type Parameters

• **Options** *extends* `Record`\<`string`, `unknown`\>
