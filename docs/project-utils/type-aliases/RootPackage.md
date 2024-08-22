[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [project-utils](../README.md) / RootPackage

# Type alias: RootPackage

> **RootPackage**: `object`

An object representing the root or "top-level" package in a monorepo or
polyrepo project.

## Type declaration

### json

> **json**: `PackageJsonWithConfig`

The contents of the root package.json file.

### packages

> **packages**: `Map`\<[`WorkspacePackageName`](WorkspacePackageName.md), [`WorkspacePackage`](WorkspacePackage.md)\> & `object` \| `null`

A mapping of sub-root package names to WorkspacePackage objects in a
monorepo or `null` in a polyrepo.

### root

> **root**: `string`

The absolute path to the root directory of the entire project.

## Source

[packages/core/src/project-utils.ts:33](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/project-utils.ts#L33)
