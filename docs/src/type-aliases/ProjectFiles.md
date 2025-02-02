[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / ProjectFiles

# Type Alias: ProjectFiles

> **ProjectFiles**: `object`

Defined in: packages/graph/dist/packages/graph/src/common.d.ts:82

A collection of AbsolutePaths within this project organized by
location and utility.

Unnamed and broken workspaces/packages are ignored.

## Type declaration

### mainBinFiles

> **mainBinFiles**: `object`

The first defined `bin` value (i.e. each package's "main binary") within
the project's root and sub-root `package.json`'s files.

#### mainBinFiles.atAnyRoot

> **atAnyRoot**: `AbsolutePath`[]

In effect, this property is sugar for `atProjectRoot + atWorkspaceRoot`.

#### mainBinFiles.atProjectRoot

> **atProjectRoot**: `AbsolutePath` \| `undefined`

An absolute path to an executable derived from the project's root
`package.json` `bin` value (if it exists).

#### mainBinFiles.atWorkspaceRoot

> **atWorkspaceRoot**: `Map`\<[`WorkspacePackageId`](WorkspacePackageId.md), `AbsolutePath` \| `undefined`\>

A map of [WorkspacePackageId](WorkspacePackageId.md)s to zero or more absolute executable
paths derived from each workspace's root `package.json` `bin` value (if
it exists).

### markdownFiles

> **markdownFiles**: `object`

The project's Markdown (.md) files.

#### markdownFiles.all

> **all**: `AbsolutePath`[]

In effect, this property is sugar for `inRoot + inWorkspace`.

#### markdownFiles.inRoot

> **inRoot**: `AbsolutePath`[]

An array of zero or more absolute paths to Markdown files within the
project but not within any workspace.

#### markdownFiles.inWorkspace

> **inWorkspace**: `Map`\<[`WorkspacePackageId`](WorkspacePackageId.md), `AbsolutePath`[]\>

A map of [WorkspacePackageId](WorkspacePackageId.md)s to zero or more absolute paths to
Markdown files within the project's workspaces.

### packageJsonFiles

> **packageJsonFiles**: `object`

The project's various `package.json` files.

#### packageJsonFiles.atAnyRoot

> **atAnyRoot**: `AbsolutePath`[]

In effect, this property is sugar for `atProjectRoot + atWorkspaceRoot`.

#### packageJsonFiles.atProjectRoot

> **atProjectRoot**: `AbsolutePath`

An absolute path to the project's root `package.json` file.

#### packageJsonFiles.atWorkspaceRoot

> **atWorkspaceRoot**: `Map`\<[`WorkspacePackageId`](WorkspacePackageId.md), `AbsolutePath`\>

A map of [WorkspacePackageId](WorkspacePackageId.md)s to zero or more absolute paths to
each workspace's root `package.json` files.

#### packageJsonFiles.elsewhere

> **elsewhere**: `AbsolutePath`[]

Other `package.json` files within the project that are not at a root or
sub-root. These `package.json` files are likely used to set the `type` of
surrounding JavaScript files and/or belong to unnamed or broken
workspaces.

### typescriptSrcFiles

> **typescriptSrcFiles**: `object`

The project's TypeScript (.ts, .tsx, .mts, .cts) files that are within a
`src/` directory.

#### typescriptSrcFiles.all

> **all**: `AbsolutePath`[]

In effect, this property is sugar for `inRootSrc + inWorkspaceSrc`.

#### typescriptSrcFiles.inRootSrc

> **inRootSrc**: `AbsolutePath`[]

An array of zero or more absolute paths to TypeScript files within the
project's root `src/` directory.

#### typescriptSrcFiles.inWorkspaceSrc

> **inWorkspaceSrc**: `Map`\<[`WorkspacePackageId`](WorkspacePackageId.md), `AbsolutePath`[]\>

A map of [WorkspacePackageId](WorkspacePackageId.md)s to zero or more absolute paths to
TypeScript files within each project workspace's `src/` directory.

### typescriptTestFiles

> **typescriptTestFiles**: `object`

The project's TypeScript (.ts, .tsx, .mts, .cts) files with names following
the pattern `*.test.{ts,tsx,mts,cts}` that are within a `test/` directory.

#### typescriptTestFiles.all

> **all**: `AbsolutePath`[]

In effect, this property is sugar for `inRootTest + inWorkspaceTest`.

#### typescriptTestFiles.inRootTest

> **inRootTest**: `AbsolutePath`[]

An array of zero or more absolute paths to TypeScript files with names
following the pattern `*.test.{ts,tsx,mts,cts}` that are within the
project's root `test/` directory.

#### typescriptTestFiles.inWorkspaceTest

> **inWorkspaceTest**: `Map`\<[`WorkspacePackageId`](WorkspacePackageId.md), `AbsolutePath`[]\>

A map of [WorkspacePackageId](WorkspacePackageId.md)s to zero or more absolute paths to
TypeScript files with names following the pattern
`*.test.{ts,tsx,mts,cts}` that are within each project workspace's
`test/` directory.
