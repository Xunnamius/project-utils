[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/package-root-to-id](../README.md) / packageRootToId

# Function: packageRootToId()

> **packageRootToId**(`packageRoot`): `WorkspacePackageId`

Defined in: [packages/graph/src/analysis/package-root-to-id.ts:14](https://github.com/Xunnamius/projector/blob/59b666306f350998305385510a73188f6fba94a3/packages/graph/src/analysis/package-root-to-id.ts#L14)

Synchronously determine the package-id of a package in a monorepo from the
path to the package's root directory.

Any character that is not alphanumeric will be replaced with a hyphen (-) in
the resulting package-id. If `packageRoot` ends in a path separator
character, it is trimmed off.

## Parameters

### packageRoot

`AbsolutePath`

## Returns

`WorkspacePackageId`
