[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / WorkspacePackageId

# Type Alias: WorkspacePackageId

> **WorkspacePackageId**: `string`

Defined in: [index.ts:13](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L13)

A so-called "package-id" of a workspace package. The package-id is derived
from the name of the parent directory of the package's `package.json` file,
i.e. the basename of `root`.

The package-id is alphanumeric + hyphens and must be at least one character.
