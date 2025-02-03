[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / mapRawSpecifierToPath

# Function: mapRawSpecifierToPath()

> **mapRawSpecifierToPath**(`rawAliasMappings`, `specifier`, `__namedParameters`): `RelativePath` \| `undefined`

Defined in: [packages/graph/src/alias.ts:682](https://github.com/Xunnamius/projector/blob/5f5f92eca551ebad2a8ed7123cb7ab801a86ad67/packages/graph/src/alias.ts#L682)

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

### \_\_namedParameters

#### extensionToAppend

`string` = `'.ts'`

For alias raw paths configured with `extensionless === false`, this is
the extension that will be appended to the final path. Should begin with
a "." character.

**Default**

```ts
".ts"
```

## Returns

`RelativePath` \| `undefined`
