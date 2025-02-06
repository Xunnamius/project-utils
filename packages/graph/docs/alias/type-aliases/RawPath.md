[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / RawPath

# Type Alias: RawPath

> **RawPath**: `object`

Defined in: [packages/graph/src/alias.ts:159](https://github.com/Xunnamius/projector/blob/59b666306f350998305385510a73188f6fba94a3/packages/graph/src/alias.ts#L159)

A metadata object describing an "alias path," sometimes referred to as an
"alias value". Always corresponds to an "alias key" (i.e. an "alias").

## Type declaration

### extensionless

> **extensionless**: `boolean`

If `false`, an extension will be appended to the path automatically. The
extension to be appended depends on which tooling the aliases are being
generated for.

Set `extensionless` to `false` when `path` points to a file. Otherwise, set
it to `true`.

#### Default

```ts
true
```

### path

> **path**: `RelativePath`

The eponymous "raw path". Must not contain the ":" linux path separator
character. Must not start or end with the "/" character, or start with
"./".

`path` is considered relative to the project root.

### prefix

> **prefix**: `"root"`

Determines the final path returned in lieu of a matched alias. Choices are:

- `root`: `path` will always be resolved starting from the project root.
  This resolution may be handled by this package or by the tooling itself
  depending on said tooling's capabilities.

### suffix

> **suffix**: `"none"` \| `"open"`

Determines the final path returned in lieu of a matched alias. Choices are:

- `none`: `path` will be returned as-is. This is only useful for custom
  one-off aliases and should be avoided.
- `open`: The subpath matched by the `'open'` [RawAlias.suffix](RawAlias.md#suffix)
  configuration will be appended to `path` (separated by `'/'`) and
  returned. If the corresponding [RawAlias.suffix](RawAlias.md#suffix) is not also
  configured with `{ suffix: 'open' }`, an error will be thrown.

## See

[RawAlias](RawAlias.md)
