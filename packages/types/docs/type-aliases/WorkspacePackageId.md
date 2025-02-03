[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / WorkspacePackageId

# Type Alias: WorkspacePackageId

> **WorkspacePackageId**: `string`

Defined in: [index.ts:13](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/types/src/index.ts#L13)

A so-called "package-id" of a workspace package. The package-id is derived
from the name of the parent directory of the package's `package.json` file,
i.e. the basename of `root`.

The package-id is alphanumeric + hyphens and must be at least one character.
