[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/package-root-to-id](../README.md) / packageRootToId

# Function: packageRootToId()

> **packageRootToId**(`packageRoot`): `string`

Defined in: [packages/graph/src/analysis/package-root-to-id.ts:14](https://github.com/Xunnamius/projector/blob/75b2ac9b21c6609d9b8cc2f9871d2d58f0db3dfa/packages/graph/src/analysis/package-root-to-id.ts#L14)

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
