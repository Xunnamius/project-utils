[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / packageRootToId

# Function: packageRootToId()

> **packageRootToId**(`packageRoot`): [`WorkspacePackageId`](../type-aliases/WorkspacePackageId.md)

Defined in: packages/graph/dist/packages/graph/src/analysis/package-root-to-id.d.ts:11

Synchronously determine the package-id of a package in a monorepo from the
path to the package's root directory.

Any character that is not alphanumeric will be replaced with a hyphen (-) in
the resulting package-id. If `packageRoot` ends in a path separator
character, it is trimmed off.

## Parameters

### packageRoot

`AbsolutePath`

## Returns

[`WorkspacePackageId`](../type-aliases/WorkspacePackageId.md)
