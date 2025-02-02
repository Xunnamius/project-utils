[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / WorkspacePackageId

# Type Alias: WorkspacePackageId

> **WorkspacePackageId**: `string`

Defined in: packages/types/dist/packages/types/src/index.d.ts:11

A so-called "package-id" of a workspace package. The package-id is derived
from the name of the parent directory of the package's `package.json` file,
i.e. the basename of `root`.

The package-id is alphanumeric + hyphens and must be at least one character.
