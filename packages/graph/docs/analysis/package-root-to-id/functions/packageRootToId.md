[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/package-root-to-id](../README.md) / packageRootToId

# Function: packageRootToId()

> **packageRootToId**(`packageRoot`): `string`

Defined in: [packages/graph/src/analysis/package-root-to-id.ts:14](https://github.com/Xunnamius/projector/blob/e9ee21374a7ed831ce875c6adff409f48ae6e839/packages/graph/src/analysis/package-root-to-id.ts#L14)

Synchronously determine the package-id of a package in a monorepo from the
path to the package's root directory.

Any character that is not alphanumeric will be replaced with a hyphen (-) in
the resulting package-id. If `packageRoot` ends in a path separator
character, it is trimmed off.

## Parameters

### packageRoot

`AbsolutePath`

## Returns

`string`
