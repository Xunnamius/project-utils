[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [resolvers](../README.md) / resolveEntryPointsFromImportsTarget

# Function: resolveEntryPointsFromImportsTarget()

> **resolveEntryPointsFromImportsTarget**(`__namedParameters`): `string`[]

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:353](https://github.com/Xunnamius/projector/blob/61532866dbae96e2887c058c574cab9291a80986/packages/bidirectional-resolve/src/resolvers.ts#L353)

Given `target` and `conditions`, this function returns an array of zero or
more entry points that are guaranteed to resolve to `target` when the exact
`conditions` are active in the runtime. This is done by reverse-mapping
`target` using `imports` from `package.json`. `imports` is assumed to be
valid.

Entry points are sorted in the order they're encountered with the caveat that
exact subpaths always come before subpath patterns. Note that, if `target`
contains one or more asterisks, the subpaths returned by this function will
also contain an asterisk. The only other time this function returns a subpath
with an asterisk is if the subpath is a "many-to-one" mapping; that is: the
subpath has an asterisk but its target does not. For instance:

## Parameters

### \_\_namedParameters

`object` & [`FlattenedImportsOption`](../type-aliases/FlattenedImportsOption.md) & [`ConditionsOption`](../type-aliases/ConditionsOption.md) & [`UnsafeFallbackOption`](../type-aliases/UnsafeFallbackOption.md) & [`ReplaceSubpathAsterisksOption`](../type-aliases/ReplaceSubpathAsterisksOption.md)

## Returns

`string`[]

## Example

```json
{
  "imports": {
    "many-to-one-subpath-returned-with-asterisk-1/*": "target-with-no-asterisk.js",
    "many-to-one-subpath-returned-with-asterisk-2/*": null,
  }
}
```

In this case, the asterisk can be replaced with literally anything and it
would still match. Hence, the replacement is left up to the caller.
