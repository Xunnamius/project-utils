[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / resolveTargetWithResolveExports

# Function: resolveTargetWithResolveExports()

> **resolveTargetWithResolveExports**(`__namedParameters`): [`ResolvedSummary`](../type-aliases/ResolvedSummary.md) & `object`

Defined in: [test/util.ts:127](https://github.com/Xunnamius/projector/blob/acc63ea8f0dbfad865586dad5763b8a39fe558a0/test/util.ts#L127)

Resolves a subpath to a target using the resolve.exports library. This
function is used to ensure project-utils's resolver functions return results
that coincide with resolve.exports in the interest of ecosystem
interoperability.

## Parameters

### \_\_namedParameters

#### conditions

`string`[]

Conditions to match against during target resolution.

#### packageJson

`XPackageJson`

Contents of the `package.json` file of the package under test.

#### subpath

`string`

The subpath to resolve against the `packageName` package. Must start with
either "#" or "./" or be "." exactly.

## Returns

[`ResolvedSummary`](../type-aliases/ResolvedSummary.md) & `object`
