[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/package-root-to-id](../README.md) / packageRootToId

# Function: packageRootToId()

> **packageRootToId**(`packageRoot`): `string`

Defined in: [packages/graph/src/analysis/package-root-to-id.ts:14](https://github.com/Xunnamius/projector/blob/7505ea44374986d1d0ddf3a37cdd5d3729450f39/packages/graph/src/analysis/package-root-to-id.ts#L14)

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
