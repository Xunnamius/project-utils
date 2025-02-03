[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [constant](../README.md) / sharedAttributeFileBase

# Variable: sharedAttributeFileBase

> `const` **sharedAttributeFileBase**: `".shared"` = `'.shared'`

Defined in: [packages/graph/src/constant.ts:346](https://github.com/Xunnamius/projector/blob/5f5f92eca551ebad2a8ed7123cb7ab801a86ad67/packages/graph/src/constant.ts#L346)

The basename of the well-known "shared attribute file". The presence of this
file at a workspace sub-root signifies that commits scoped to said package
will be included by other packages in the project.

By default, commits scoped to individual packages are ignored by other
packages.
