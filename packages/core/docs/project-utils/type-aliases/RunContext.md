[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [project-utils](../README.md) / RunContext

# Type alias: RunContext

> **RunContext**: `object`

An object representing a runtime context.

## Type declaration

### context

> **context**: `"monorepo"` \| `"polyrepo"`

Whether node is executing in a monorepo or a polyrepo context.

### package

> **package**: [`WorkspacePackage`](WorkspacePackage.md) \| `null`

An object representing the current sub-root (determined by cwd) in a
monorepo context, or `null` if in a polyrepo context or when cwd is not
within any sub-root in a monorepo context.

### project

> **project**: [`RootPackage`](RootPackage.md)

Repository root package data.

## Source

[packages/core/src/project-utils.ts:93](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/project-utils.ts#L93)
