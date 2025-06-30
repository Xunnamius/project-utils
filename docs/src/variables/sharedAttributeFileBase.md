[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / sharedAttributeFileBase

# Variable: sharedAttributeFileBase

> `const` **sharedAttributeFileBase**: `".shared"` = `".shared"`

Defined in: packages/graph/dist/packages/graph/src/constant.d.ts:293

The basename of the well-known "shared attribute file". The presence of this
file at a workspace sub-root signifies that commits scoped to said package
will be included by other packages in the project.

By default, commits scoped to individual packages are ignored by other
packages.
