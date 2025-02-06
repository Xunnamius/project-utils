[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / resolveTargetWithNodeJs

# Function: resolveTargetWithNodeJs()

> **resolveTargetWithNodeJs**(`__namedParameters`): `Promise`\<[`ResolvedSummary`](../type-aliases/ResolvedSummary.md)\>

Defined in: [test/util.ts:35](https://github.com/Xunnamius/projector/blob/17e0fc2cbfbba96d7aaeeb5e98ce42b294402225/test/util.ts#L35)

Resolves a subpath to a target using the Node.js runtime. This function is
used to ensure project-utils's resolver functions follow the Node.js resolver
spec.

## Parameters

### \_\_namedParameters

#### conditions

`string`[]

Conditions to match against during subpath resolution.

#### packageName

`string`

Name of the package to resolve subpaths against.

#### rootPackagePath

`string`

Path to the root of the package that contains the `packageName` package in
its `node_modules` directory if testing `exports` or the path to the root
of the `packageName` package if testing `imports`.

#### subpath

`string`

The subpath to resolve against the `packageName` package. Must start with
either "#" or "./" or be "." exactly or the behavior of this function is
undefined.

Note that if the subpath ends in the strings "package" or ".json", the
import will use the "type: json" attribute.

## Returns

`Promise`\<[`ResolvedSummary`](../type-aliases/ResolvedSummary.md)\>
