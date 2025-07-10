[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [common](../README.md) / ProjectFiles

# Type Alias: ProjectFiles

> **ProjectFiles** = `object`

Defined in: [packages/graph/src/common.ts:100](https://github.com/Xunnamius/projector/blob/b410307fe2da8a8f1d44526700e14694b1e77559/packages/graph/src/common.ts#L100)

A collection of AbsolutePaths within this project organized by
location and utility.

Unnamed and broken workspaces/packages are ignored.

## Properties

### mainBinFiles

> **mainBinFiles**: `object`

Defined in: [packages/graph/src/common.ts:130](https://github.com/Xunnamius/projector/blob/b410307fe2da8a8f1d44526700e14694b1e77559/packages/graph/src/common.ts#L130)

The first defined `bin` value (i.e. each package's "main binary") within
the project's root and sub-root `package.json`'s files.

#### atAnyRoot

> **atAnyRoot**: `AbsolutePath`[]

In effect, this property is sugar for `atProjectRoot + atWorkspaceRoot`.

#### atProjectRoot

> **atProjectRoot**: `AbsolutePath` \| `undefined`

An absolute path to an executable derived from the project's root
`package.json` `bin` value (if it exists).

#### atWorkspaceRoot

> **atWorkspaceRoot**: `Map`\<`WorkspacePackageId`, `AbsolutePath` \| `undefined`\>

A map of WorkspacePackageIds to zero or more absolute executable
paths derived from each workspace's root `package.json` `bin` value (if
it exists).

***

### markdownFiles

> **markdownFiles**: `object`

Defined in: [packages/graph/src/common.ts:150](https://github.com/Xunnamius/projector/blob/b410307fe2da8a8f1d44526700e14694b1e77559/packages/graph/src/common.ts#L150)

The project's Markdown (.md) files.

#### all

> **all**: `AbsolutePath`[]

In effect, this property is sugar for `inRoot + inWorkspace`.

#### inRoot

> **inRoot**: `AbsolutePath`[]

An array of zero or more absolute paths to Markdown files within the
project but not within any workspace.

#### inWorkspace

> **inWorkspace**: `Map`\<`WorkspacePackageId`, `AbsolutePath`[]\>

A map of WorkspacePackageIds to zero or more absolute paths to
Markdown files within the project's workspaces.

***

### packageJsonFiles

> **packageJsonFiles**: `object`

Defined in: [packages/graph/src/common.ts:104](https://github.com/Xunnamius/projector/blob/b410307fe2da8a8f1d44526700e14694b1e77559/packages/graph/src/common.ts#L104)

The project's various `package.json` files.

#### atAnyRoot

> **atAnyRoot**: `AbsolutePath`[]

In effect, this property is sugar for `atProjectRoot + atWorkspaceRoot`.

#### atProjectRoot

> **atProjectRoot**: `AbsolutePath`

An absolute path to the project's root `package.json` file.

#### atWorkspaceRoot

> **atWorkspaceRoot**: `Map`\<`WorkspacePackageId`, `AbsolutePath`\>

A map of WorkspacePackageIds to zero or more absolute paths to
each workspace's root `package.json` files.

#### elsewhere

> **elsewhere**: `AbsolutePath`[]

Other `package.json` files within the project that are not at a root or
sub-root. These `package.json` files are likely used to set the `type` of
surrounding JavaScript files and/or belong to unnamed or broken
workspaces.

***

### typescriptSrcFiles

> **typescriptSrcFiles**: `object`

Defined in: [packages/graph/src/common.ts:170](https://github.com/Xunnamius/projector/blob/b410307fe2da8a8f1d44526700e14694b1e77559/packages/graph/src/common.ts#L170)

The project's TypeScript (.ts, .tsx, .mts, .cts) files that are within a
`src/` directory.

#### all

> **all**: `AbsolutePath`[]

In effect, this property is sugar for `inRootSrc + inWorkspaceSrc`.

#### inRootSrc

> **inRootSrc**: `AbsolutePath`[]

An array of zero or more absolute paths to TypeScript files within the
project's root `src/` directory.

#### inWorkspaceSrc

> **inWorkspaceSrc**: `Map`\<`WorkspacePackageId`, `AbsolutePath`[]\>

A map of WorkspacePackageIds to zero or more absolute paths to
TypeScript files within each project workspace's `src/` directory.

***

### typescriptTestFiles

> **typescriptTestFiles**: `object`

Defined in: [packages/graph/src/common.ts:190](https://github.com/Xunnamius/projector/blob/b410307fe2da8a8f1d44526700e14694b1e77559/packages/graph/src/common.ts#L190)

The project's TypeScript (.ts, .tsx, .mts, .cts) files with names following
the pattern `*.test.{ts,tsx,mts,cts}` that are within a `test/` directory.

#### all

> **all**: `AbsolutePath`[]

In effect, this property is sugar for `inRootTest + inWorkspaceTest`.

#### inRootTest

> **inRootTest**: `AbsolutePath`[]

An array of zero or more absolute paths to TypeScript files with names
following the pattern `*.test.{ts,tsx,mts,cts}` that are within the
project's root `test/` directory.

#### inWorkspaceTest

> **inWorkspaceTest**: `Map`\<`WorkspacePackageId`, `AbsolutePath`[]\>

A map of WorkspacePackageIds to zero or more absolute paths to
TypeScript files with names following the pattern
`*.test.{ts,tsx,mts,cts}` that are within each project workspace's
`test/` directory.
