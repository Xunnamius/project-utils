[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [common](../README.md) / PackageBuildTargets

# Type Alias: PackageBuildTargets

> **PackageBuildTargets** = `object`

Defined in: [packages/graph/src/common.ts:35](https://github.com/Xunnamius/projector/blob/8083fdfb8119466a16efa45bfe532af41d9ff256/packages/graph/src/common.ts#L35)

In the context of a Package, this object represents a collection of
all the file paths **relative to the _project root_** that must be transpiled
(source; typically TypeScript files) and/or copied (assets; typically
everything that isn't a TypeScript file) to build a specific package.

These paths are split into internal and external
[PackageBuildTargets.targets](#targets). Interesting
[PackageBuildTargets.metadata](#metadata) is returned as well.

## Properties

### metadata

> **metadata**: `object`

Defined in: [packages/graph/src/common.ts:65](https://github.com/Xunnamius/projector/blob/8083fdfb8119466a16efa45bfe532af41d9ff256/packages/graph/src/common.ts#L65)

#### imports

> **imports**: `object`

##### imports.aliasCounts

> **aliasCounts**: `Record`\<`string`, \{ `count`: `number`; `prefixes`: `Set`\<[`MetadataImportsPrefix`](../../analysis/gather-package-build-targets/type-aliases/MetadataImportsPrefix.md)\>; \}\>

A mapping between well-known import aliases within the project and the
number of times they are imported by the build target files.

Imports also have tags in the form of "prefixes". See
`gatherPackageBuildTargets` for details.

##### imports.dependencyCounts

> **dependencyCounts**: `Record`\<`string`, \{ `count`: `number`; `prefixes`: `Set`\<[`MetadataImportsPrefix`](../../analysis/gather-package-build-targets/type-aliases/MetadataImportsPrefix.md)\>; \}\>

A mapping between packages imported from outside the project, such as
builtins (e.g. from Node) and dependencies (e.g. node_modules), and the
number of times those packages are imported by the build target files.

Imports also have tags in the form of "prefixes". See
`gatherPackageBuildTargets` for details.

***

### targets

> **targets**: `object`

Defined in: [packages/graph/src/common.ts:40](https://github.com/Xunnamius/projector/blob/8083fdfb8119466a16efa45bfe532af41d9ff256/packages/graph/src/common.ts#L40)

The file paths, **relative to the _project root_**, that must be transpiled
and/or copied when building a specific Package's distributables.

#### external

> **external**: `object`

These RelativePaths are the so-called "multiversal" build targets
external to the package. They are derived from import specifiers and can
be any file type.

These paths will always be **relative to the _project root_**.

Unlike `targets.internal`, this property contains two sets of
RelativePaths: type-only imports and normal imports. Do note that
(1) specifiers will _never_ exist in both sets simultaneously and (2) all
imports of type-only imports will also be classified as type-only imports
regardless of their "import kind" _unless_ they are also imported by a
normal import.

##### external.normal

> **normal**: `Set`\<`RelativePath`\>

##### external.typeOnly

> **typeOnly**: `Set`\<`RelativePath`\>

#### internal

> **internal**: `Set`\<`RelativePath`\>

These RelativePaths are the internal build targets belonging to
the package. They are the contents of `${packageRoot}/src` and can be any
file type.

These paths will always be **relative to the _project root_**.
