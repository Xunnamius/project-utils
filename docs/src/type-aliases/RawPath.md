[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / RawPath

# Type Alias: RawPath

> **RawPath** = `object`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:131

A metadata object describing an "alias path," sometimes referred to as an
"alias value". Always corresponds to an "alias key" (i.e. an "alias").

## See

[RawAlias](RawAlias.md)

## Properties

### extensionless

> **extensionless**: `boolean`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:169

If `false`, an extension will be appended to the path automatically. The
extension to be appended depends on which tooling the aliases are being
generated for.

Set `extensionless` to `false` when `path` points to a file. Otherwise, set
it to `true`.

#### Default

```ts
true
```

***

### path

> **path**: `RelativePath`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:158

The eponymous "raw path". Must not contain the ":" linux path separator
character. Must not start or end with the "/" character, or start with
"./".

`path` is considered relative to the project root.

***

### prefix

> **prefix**: `"root"`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:139

Determines the final path returned in lieu of a matched alias. Choices are:

- `root`: `path` will always be resolved starting from the project root.
  This resolution may be handled by this package or by the tooling itself
  depending on said tooling's capabilities.

***

### suffix

> **suffix**: `"none"` \| `"open"`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:150

Determines the final path returned in lieu of a matched alias. Choices are:

- `none`: `path` will be returned as-is. This is only useful for custom
  one-off aliases and should be avoided.
- `open`: The subpath matched by the `'open'` [RawAlias.suffix](RawAlias.md#suffix)
  configuration will be appended to `path` (separated by `'/'`) and
  returned. If the corresponding [RawAlias.suffix](RawAlias.md#suffix) is not also
  configured with `{ suffix: 'open' }`, an error will be thrown.
