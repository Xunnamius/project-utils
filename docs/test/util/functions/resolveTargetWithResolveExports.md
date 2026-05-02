[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / resolveTargetWithResolveExports

# Function: resolveTargetWithResolveExports()

> **resolveTargetWithResolveExports**(`__namedParameters`): [`ResolvedSummary`](../type-aliases/ResolvedSummary.md) & `object`

Defined in: [test/util.ts:133](https://github.com/Xunnamius/projector/blob/68e4fc6f2a243c194fa5573f168824fede094394/test/util.ts#L133)

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
