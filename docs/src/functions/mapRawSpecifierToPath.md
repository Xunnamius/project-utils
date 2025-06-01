[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / mapRawSpecifierToPath

# Function: mapRawSpecifierToPath()

> **mapRawSpecifierToPath**(`rawAliasMappings`, `specifier`, `__namedParameters?`): `undefined` \| `RelativePath`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:309

Accepts a _raw `specifier`_ and returns an "bare" RelativePath (in
that it does not begin with "./") to a theoretical location on the filesystem
or `undefined` if `specifier` does not match any `rawAliasMappings`.

The path returned by this function is always relative to the project root.

A "raw `specifier`" is the specifier string of an import statement before it
has been resolved to a real filesystem path (such as by this function).

## Parameters

### rawAliasMappings

`Arrayable`\<[`RawAliasMapping`](../type-aliases/RawAliasMapping.md)\>

### specifier

`string`

### \_\_namedParameters?

#### extensionToAppend?

`string`

For alias raw paths configured with `extensionless === false`, this is
the extension that will be appended to the final path. Should begin with
a "." character.

**Default**

```ts
".ts"
```

## Returns

`undefined` \| `RelativePath`
