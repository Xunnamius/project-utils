[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / generateRawAliasMap

# Function: generateRawAliasMap()

> **generateRawAliasMap**(`projectMetadata`, `outputTarget`): [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

Defined in: [packages/graph/src/alias.ts:311](https://github.com/Xunnamius/projector/blob/9c68f75450e3c8cd36c484a1863f7d61992f83cc/packages/graph/src/alias.ts#L311)

Given `projectMetadata`, this function returns an array of
[RawAliasMapping](../type-aliases/RawAliasMapping.md) entries. Each entry maps an import specifier alias
([RawAlias](../type-aliases/RawAlias.md)) to a filesystem path ([RawPath](../type-aliases/RawPath.md)) used throughout
said project. Filesystem paths will always be generated as relative paths
with respect to the project root.

Entries will be returned in the order expected for the majority of
configuration subsystems: multiverse \> universe \> testverse \> typeverse \>
rootverse. An alternative order, expected for import sorting, is also
available (via `outputTarget`): multiverse \> rootverse \> universe \>
testverse \> typeverse.

Entries within the same verse are sorted in "specificity" order, meaning
open-suffix aliases will have a chance to match before exact-suffix aliases,
and more specific open-suffix aliases will have a chance to match before
less-specific or catch-all open-suffix aliases. Entries of the same
"specificity" will then be natural sorted.

(Unsorted) examples of supported aliases:
- `"universe"`                           (root ./index.ts)
- `"universe:some/path/index.ts"`        (root ./src/some/path/index.ts)
- `"multiverse+package-id"`              (package ./src/index.js)
- `"multiverse+package-id:some/path.js"` (package ./src/some/path.js)
- `"testverse:some/path.ts"`             (root ./test/some/path.ts)
- `"testverse+package-id:some/path.ts"`  (package ./test/some/path.ts)
- `"multiverse+common:types.ts"`         (root ./types/global.ts)
- `"rootverse:some/path.js"`             (root ./some/path.js)
- `"rootverse+package-id:some/path.ts"`  (package ./some/path.ts)

## Parameters

### projectMetadata

`GenericProjectMetadata`

### outputTarget

This controls the order of the elements of this function's output. The
options are:

- for-config: the output is ordered for general consumption by tooling
- for-import-ordering: the output is ordered for eslint-plugin-import
- for-import-hinting: the output is ordered for tsconfig

`"for-import-ordering"` is useful for automatic import ordering and sorting
powered by eslint. `"for-import-hinting"` ensures that aliases are ordered
in such a way that TypeScript-based intellisense will return more prudent
results.

`"for-config"` | `"for-import-ordering"` | `"for-import-hinting"`

## Returns

[`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

## See

https://github.com/Xunnamius/symbiote/wiki/Standard-Aliases
