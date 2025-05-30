[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / ensureRawSpecifierOk

# Function: ensureRawSpecifierOk()

> **ensureRawSpecifierOk**(`rawAliasMappings`, `specifier`, `__namedParameters`): `void`

Defined in: [packages/graph/src/alias.ts:738](https://github.com/Xunnamius/projector/blob/2730a290426f956d4d09df6f5838fcf6186fbf1f/packages/graph/src/alias.ts#L738)

This function throws if the given specifier violates any general symbiote
project invariants with respect to the given [RawAliasMapping](../type-aliases/RawAliasMapping.md)s.

## Parameters

### rawAliasMappings

`Arrayable`\<[`RawAliasMapping`](../type-aliases/RawAliasMapping.md)\>

### specifier

`string`

### \_\_namedParameters

#### allowForeignUniversalImports

`boolean`

Unless `true`, if `packageId` is defined and a universe import not
belonging to `packageId` is encountered, this function will throw.

Note that foreign universal imports are a type of multiversal import and
as such are additionally governed by `allowMultiversalImports`.

#### allowMultiversalImports

`boolean`

Unless `true`, if a multiverse import not belonging to `packageId` is
encountered, this function will throw.

Note that multiversal testverse and typeverse imports, while technically
multiversal imports, are _never_ governed by this property.

#### allowRootverseNodeModules

`boolean`

Unless `true`, if a rootverse import precariously referencing
node_modules is encountered, this function will throw.

Note that multiversal rootverse imports of node_modules are a type of
multiversal import and as such are additionally governed by
`allowMultiversalImports`.

#### allowTestversalImports

`boolean`

Unless `true`, if a testverse import is encountered, this function will
throw.

Note that multiversal testverse imports, while technically a type of
multiversal import, are _never_ governed by `allowMultiversalImports`.

#### containingFilePath?

`string`

A string representing the file containing the alias that, if given, will
be included in any exceptions thrown by this function.

#### extensionToAppend?

`string` = `'.ts'`

This is the extension potentially appended to `specifier` if alias raw
path was configured with `extensionless === false`. Should begin with a
"." character.

This value is used only to check for bad index imports and is so named
for consistency's sake. No appending of extensions is performed by this
function.

**Default**

```ts
".ts"
```

#### packageId?

`string`

Since it is ill-advised to make universe imports from within a sub-root,
such imports should not be seen when we're building distributables for a
workspace package. If `packageId` is not `undefined`, this check will be
enabled.

Additionally, defining `packageId` enables multiverse self-reference
checks to ensure a sub-root is not using a multiverse alias to import its
own files, which is suboptimal.

## Returns

`void`
