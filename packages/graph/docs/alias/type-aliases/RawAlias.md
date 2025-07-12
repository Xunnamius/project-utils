[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / RawAlias

# Type Alias: RawAlias

> **RawAlias** = `object`

Defined in: [packages/graph/src/alias.ts:107](https://github.com/Xunnamius/projector/blob/9157d42cdc0054cf96a3e2980daba7c8ae5a3e13/packages/graph/src/alias.ts#L107)

A metadata object describing an "alias key," sometimes referred to as an
"alias". Always corresponds to an "alias value" (i.e. an "alias path").

## See

[RawPath](RawPath.md)

## Properties

### alias

> **alias**: `string`

Defined in: [packages/graph/src/alias.ts:129](https://github.com/Xunnamius/projector/blob/9157d42cdc0054cf96a3e2980daba7c8ae5a3e13/packages/graph/src/alias.ts#L129)

The eponymous "raw alias". Must not contain any path separator characters
(i.e. "/", "\", or ":") or the "$" character.

***

### group

> **group**: [`WellKnownImportAlias`](../enumerations/WellKnownImportAlias.md)

Defined in: [packages/graph/src/alias.ts:133](https://github.com/Xunnamius/projector/blob/9157d42cdc0054cf96a3e2980daba7c8ae5a3e13/packages/graph/src/alias.ts#L133)

The well-known import alias "group" to which the raw `alias` belongs.

***

### packageId

> **packageId**: `WorkspacePackageId` \| `undefined`

Defined in: [packages/graph/src/alias.ts:150](https://github.com/Xunnamius/projector/blob/9157d42cdc0054cf96a3e2980daba7c8ae5a3e13/packages/graph/src/alias.ts#L150)

If this alias contains a reference to a package's id (e.g.
"universe+package-id"), `packageId` must be defined.

***

### prefix

> **prefix**: `"none"` \| `"exact"`

Defined in: [packages/graph/src/alias.ts:115](https://github.com/Xunnamius/projector/blob/9157d42cdc0054cf96a3e2980daba7c8ae5a3e13/packages/graph/src/alias.ts#L115)

Determines the prefix matching behavior for alias keys. Choices are:

- `none`: Any string containing `alias` may match. This is only useful for
  custom one-off aliases and should be avoided.
- `exact`: Only strings beginning with `alias` exactly may match.

***

### regExp

> **regExp**: `RegExp`

Defined in: [packages/graph/src/alias.ts:145](https://github.com/Xunnamius/projector/blob/9157d42cdc0054cf96a3e2980daba7c8ae5a3e13/packages/graph/src/alias.ts#L145)

A regular expression derived from `alias` that can be matched against
specifier strings. If this alias's `suffix` is `"open"`, the returned
expression will include a single matching group containing the full
specifier path without modification.

Any RegExp control characters present in `alias` (e.g. "+", "*", "?") will
be escaped.

#### See

[rawAliasToRegExp](../functions/rawAliasToRegExp.md)

***

### suffix

> **suffix**: `"none"` \| `"exact"` \| `"open"`

Defined in: [packages/graph/src/alias.ts:124](https://github.com/Xunnamius/projector/blob/9157d42cdc0054cf96a3e2980daba7c8ae5a3e13/packages/graph/src/alias.ts#L124)

Determines the suffix matching behavior for alias keys. Choices are:

- `none`: Any string containing `alias` may match. This has some
  tooling-specific quirks and should be avoided.
- `exact`: Only strings ending with `alias` exactly may match.
- `open`: Only strings ending with `alias + sep + subpath` may match.
