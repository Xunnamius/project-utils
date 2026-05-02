[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [constant](../README.md) / sharedAttributeFileBase

# Variable: sharedAttributeFileBase

> `const` **sharedAttributeFileBase**: `".shared"` = `'.shared'`

Defined in: [packages/graph/src/constant.ts:357](https://github.com/Xunnamius/projector/blob/8b829a35843b6bd00f87495a6c64e0da9cfd40e7/packages/graph/src/constant.ts#L357)

The basename of the well-known "shared attribute file". The presence of this
file at a workspace sub-root signifies that commits scoped to said package
will be included by other packages in the project.

By default, commits scoped to individual packages are ignored by other
packages.
