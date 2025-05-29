[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [resolvers](../README.md) / resolveEntryPointsFromExportsTarget

# Function: resolveEntryPointsFromExportsTarget()

> **resolveEntryPointsFromExportsTarget**(`__namedParameters`): `string`[]

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:273](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L273)

Given `target` and `conditions`, this function returns an array of zero or
more entry points that are guaranteed to resolve to `target` when the exact
`conditions` are active in the runtime. This is done by reverse-mapping
`target` using `exports` from `package.json`. `exports` is assumed to be
valid.

Entry points are sorted in the order they're encountered with the caveat that
exact subpaths always come before subpath patterns. Note that, if `target`
contains one or more asterisks, the subpaths returned by this function will
also contain an asterisk. The only other time this function returns a subpath
with an asterisk is if the subpath is a "many-to-one" mapping; that is: the
subpath has an asterisk but its target does not. For instance:

## Parameters

### \_\_namedParameters

`object` & [`FlattenedExportsOption`](../type-aliases/FlattenedExportsOption.md) & [`ConditionsOption`](../type-aliases/ConditionsOption.md) & [`UnsafeFallbackOption`](../type-aliases/UnsafeFallbackOption.md) & [`ReplaceSubpathAsterisksOption`](../type-aliases/ReplaceSubpathAsterisksOption.md)

## Returns

`string`[]

## Example

```json
{
  "exports": {
    "many-to-one-subpath-returned-with-asterisk-1/*": "target-with-no-asterisk.js",
    "many-to-one-subpath-returned-with-asterisk-2/*": null,
  }
}
```

In this case, the asterisk can be replaced with literally anything and it
would still match. Hence, the replacement is left up to the caller.
