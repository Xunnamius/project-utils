[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / WorkspacePackageId

# Type Alias: WorkspacePackageId

> **WorkspacePackageId**: `string`

Defined in: [index.ts:15](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L15)

A so-called "package-id" of a workspace package. The package-id is derived
from the name of the parent directory of the package's `package.json` file,
i.e. the basename of `root`.

The package-id is alphanumeric + hyphens and must be at least one character.
