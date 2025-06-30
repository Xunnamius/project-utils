[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [constant](../README.md) / sharedAttributeFileBase

# Variable: sharedAttributeFileBase

> `const` **sharedAttributeFileBase**: `".shared"` = `'.shared'`

Defined in: [packages/graph/src/constant.ts:352](https://github.com/Xunnamius/projector/blob/30ee33dd3f520f95da3402a4b1c6901f010100cc/packages/graph/src/constant.ts#L352)

The basename of the well-known "shared attribute file". The presence of this
file at a workspace sub-root signifies that commits scoped to said package
will be included by other packages in the project.

By default, commits scoped to individual packages are ignored by other
packages.
