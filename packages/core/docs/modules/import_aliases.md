[@projector-js/core][1] / import-aliases

# Module: import-aliases

## Table of contents

### Functions

- [getEslintAliases][2]
- [getJestAliases][3]
- [getProcessedAliasMapping][4]
- [getRawAliases][5]
- [getTypeScriptAliases][6]
- [getWebpackAliases][7]

## Functions

### getEslintAliases

▸ **getEslintAliases**(): `string`\[]\[]

Returns an array that can be plugged into ESLint configurations at
`settings['import/resolver'].alias.map`.

See also: [https://www.npmjs.com/package/eslint-import-resolver-alias][8]

#### Returns

`string`\[]\[]

#### Defined in

[packages/core/src/import-aliases.ts:133][9]

---

### getJestAliases

▸ **getJestAliases**(`__namedParameters?`): `Record`<`string`, `string`>

Returns an object that can be plugged into Jest configurations at
`moduleNameMapper`.

See also:
[https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring][10]

#### Parameters

| Name             | Type     | Description                                                                                                       |
| :--------------- | :------- | :---------------------------------------------------------------------------------------------------------------- |
| `(destructured)` | `Object` | -                                                                                                                 |
| `({ rootDir? })` | `string` | The root directory of the project as an absolute path. Supplying a relative path will lead to undefined behavior. |

#### Returns

`Record`<`string`, `string`>

#### Defined in

[packages/core/src/import-aliases.ts:180][11]

---

### getProcessedAliasMapping

▸ **getProcessedAliasMapping**(`(destructured)`): readonly \[{ `alias`: `string`
; `prefix`: `null` | `"^"` ; `suffix`: `null` | `"/(.*)$"` | `"$"` }, { `path`:
`null` | `string` ; `prefix`: `"."` | `"<rootDir>"` ; `suffix`: `null` | `"/$1"`
}]

Takes an alias mapping, validates it, and returns its constituent parts.

#### Parameters

| Name                            | Type                          | Description                                                                                                                                            |
| :------------------------------ | :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `(destructured)`                | `Object`                      | -                                                                                                                                                      |
| `({ issueTypescriptWarning? })` | `boolean`                     | If true, attempting to resolve an alias at runtime, which TypeScript does not support, will trigger a TypeScript-specific warning. **`default`** false |
| `({ mapping })`                 | \[key: string, value: string] | A single mapping between an alias `key` and its real path `value`.                                                                                     |

#### Returns

readonly \[{ `alias`: `string` ; `prefix`: `null` | `"^"` ; `suffix`: `null` |
`"/(.*)$"` | `"$"` }, { `path`: `null` | `string` ; `prefix`: `"."` |
`"<rootDir>"` ; `suffix`: `null` | `"/$1"` }]

#### Defined in

[packages/core/src/import-aliases.ts:52][12]

---

### getRawAliases

▸ **getRawAliases**(): `Object`

A mapping of import/require aliases used throughout the project. Object keys
represent aliases their corresponding values represent mappings to the
filesystem.

Since this is used by several tooling subsystems with several different alias
syntaxes (some even allowing regular expression syntax), the most permissive of
the syntaxes is used to define the generic "raw" aliases below. Later, these are
reduced to their tooling-specific syntaxes.

**_Raw Alias Syntax Rules_**

1.  Each key contains no path separators (excluding rule #3)
2.  Each key starts with word character or ^
3.  Each key ends with "/(.\*)$" (open-ended) or "$" (exact) or word character
4.  Each value starts with "./" (relative path) or "<rootDir>" (repo root)
5.  Each value ends with "/$1" or any other character except "/"
6.  Values representing directory paths end with "/$1"
7.  Values ending with "/$1" have corresponding keys ending with "/(.\*)$" and
    vice-versa

Note: the raw alias syntax rules are a subset of Jest's module name mapping
syntax.

#### Returns

`Object`

| Name                | Type     |
| :------------------ | :------- |
| `^externals/(.*)$`  | `string` |
| `^multiverse/(.*)$` | `string` |
| `^package$`         | `string` |
| `^pkgverse/(.*)$`   | `string` |
| `^testverse/(.*)$`  | `string` |
| `^types/(.*)$`      | `string` |
| `^universe/(.*)$`   | `string` |

#### Defined in

[packages/core/src/import-aliases.ts:37][13]

---

### getTypeScriptAliases

▸ **getTypeScriptAliases**(): `Record`<`string`, `string`\[]>

Returns an object that is the basis of the TSConfig JSON files extended by
external TypeScript configurations at `compilerOptions.paths`.

#### Returns

`Record`<`string`, `string`\[]>

#### Defined in

[packages/core/src/import-aliases.ts:215][14]

---

### getWebpackAliases

▸ **getWebpackAliases**(`__namedParameters?`): `Record`<`string`, `string`>

Returns an object that can be plugged into Webpack configurations (including
`next.config.js`) at `resolve.alias`.

See also: [https://webpack.js.org/configuration/resolve/#resolvealias][15]

#### Parameters

| Name             | Type     | Description                                                                                                       |
| :--------------- | :------- | :---------------------------------------------------------------------------------------------------------------- |
| `(destructured)` | `Object` | -                                                                                                                 |
| `({ rootDir? })` | `string` | The root directory of the project as an absolute path. Supplying a relative path will lead to undefined behavior. |

#### Returns

`Record`<`string`, `string`>

#### Defined in

[packages/core/src/import-aliases.ts:146][16]

[1]: ../README.md
[2]: import_aliases.md#geteslintaliases
[3]: import_aliases.md#getjestaliases
[4]: import_aliases.md#getprocessedaliasmapping
[5]: import_aliases.md#getrawaliases
[6]: import_aliases.md#gettypescriptaliases
[7]: import_aliases.md#getwebpackaliases
[8]: https://www.npmjs.com/package/eslint-import-resolver-alias
[9]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/import-aliases.ts#L133
[10]:
  https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring
[11]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/import-aliases.ts#L180
[12]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/import-aliases.ts#L52
[13]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/import-aliases.ts#L37
[14]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/import-aliases.ts#L215
[15]: https://webpack.js.org/configuration/resolve/#resolvealias
[16]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/import-aliases.ts#L146
