[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / generateRawAliasMap

# Function: generateRawAliasMap()

> **generateRawAliasMap**(`projectMetadata`): [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

Defined in: [packages/graph/src/alias.ts:306](https://github.com/Xunnamius/projector/blob/b164ec02958be4a3fc50929ad4f824678a7453d6/packages/graph/src/alias.ts#L306)

Given `projectMetadata`, this function returns an array of
[RawAliasMapping](../type-aliases/RawAliasMapping.md) entries. Each entry maps an import specifier alias
([RawAlias](../type-aliases/RawAlias.md)) to a filesystem path ([RawPath](../type-aliases/RawPath.md)) used throughout
said project. Filesystem paths will always be generated as relative paths
with respect to the project root.

Entries will be returned in standard verse order: multiverse > rootverse >
universe > testverse > typeverse. Entries within the same verse are sorted in
"specificity" order, meaning open-suffix aliases will have a chance to match
before exact-suffix aliases, and more specific open-suffix aliases will have
a chance to match before less-specific or catch-all open-suffix aliases.
Entries of the same "specificity" will then be natural sorted.

Examples of supported aliases:
- `"universe"`                           (root ./index.ts)
- `"universe:some/path/index.ts"`        (root ./src/some/path/index.ts)
- `"multiverse+package-id"`              (package ./src/index.js)
- `"multiverse+package-id:some/path.js"` (package ./src/some/path.js)
- `"testverse:some/path.ts"`             (root ./test/some/path.ts)
- `"testverse+package-id:some/path.ts"`  (package ./test/some/path.ts)
- `"multiverse+common:types.ts"`                (root ./types/global.ts)
- `"rootverse:some/path.js"`             (root ./some/path.js)
- `"rootverse+package-id:some/path.ts"`  (package ./some/path.ts)

## Parameters

### projectMetadata

`GenericProjectMetadata`

## Returns

[`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

## See

https://github.com/Xunnamius/symbiote/wiki/Standard-Aliases
