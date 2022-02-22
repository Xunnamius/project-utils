[@projector-js/core][1] / monorepo-utils

# Module: monorepo-utils

## Table of contents

### Classes

- [BadPackageJsonError][2]
- [ContextError][3]
- [NotAGitRepositoryError][4]
- [PackageJsonNotFoundError][5]

### Type aliases

- [MonorepoRunContext][6]
- [PolyrepoRunContext][7]
- [RunContext][8]

### Functions

- [getRunContext][9]

## Type aliases

### MonorepoRunContext

Ƭ **MonorepoRunContext**: [`RunContext`][8] & { `context`: `"monorepo"` ;
`package`: `NonNullable`<[`RunContext`][8]\[`"package"`]> ; `project`:
[`RunContext`][8]\[`"project"`] & { `packages`:
`NonNullable`<[`RunContext`][8]\[`"project"`]\[`"packages"`]> } }

#### Defined in

[packages/core/src/monorepo-utils.ts:63][10]

---

### PolyrepoRunContext

Ƭ **PolyrepoRunContext**: [`RunContext`][8] & { `context`: `"polyrepo"` ;
`package`: `null` ; `project`: [`RunContext`][8]\[`"project"`] & { `packages`:
`null` } }

#### Defined in

[packages/core/src/monorepo-utils.ts:71][11]

---

### RunContext

Ƭ **RunContext**: `Object`

An object representing a runtime context.

#### Type declaration

| Name               | Type                                                                                           | Description                                                                                                                                                                          |
| :----------------- | :--------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context`          | `"monorepo"` \| `"polyrepo"`                                                                   | Whether `cwd` is contained by a monorepo or a polyrepo.                                                                                                                              |
| `package`          | { `id`: `string` \| `null` ; `json`: `PackageWithPath` ; `root`: `string` } \| `null`          | Package root data in a monorepo `context`, or `null` in a polyrepo `context`. When `cwd` is only contained by the project root in a monorepo `context`, `package.id` will be `null`. |
| `project`          | { `json`: `PackageJson` ; `packages`: `Map`<`string`, `string`> \| `null` ; `root`: `string` } | Repository root package data.                                                                                                                                                        |
| `project.json`     | `PackageJson`                                                                                  | The project root package.json file's contents.                                                                                                                                       |
| `project.packages` | `Map`<`string`, `string`> \| `null`                                                            | A mapping of package names to directory paths in a monorepo `context` or `null` in a polyrepo `context`.                                                                             |
| `project.root`     | `string`                                                                                       | The absolute path to the root of the project that contains `cwd`.                                                                                                                    |

#### Defined in

[packages/core/src/monorepo-utils.ts:18][12]

## Functions

### getRunContext

▸ **getRunContext**(`__namedParameters?`): [`MonorepoRunContext`][6] |
[`PolyrepoRunContext`][7]

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `(destructured)` | `Object` |
| `({ cwd })`      | `string` |

#### Returns

[`MonorepoRunContext`][6] | [`PolyrepoRunContext`][7]

#### Defined in

[packages/core/src/monorepo-utils.ts:77][13]

[1]: ../README.md
[2]: ../classes/monorepo_utils.BadPackageJsonError.md
[3]: ../classes/monorepo_utils.ContextError.md
[4]: ../classes/monorepo_utils.NotAGitRepositoryError.md
[5]: ../classes/monorepo_utils.PackageJsonNotFoundError.md
[6]: monorepo_utils.md#monoreporuncontext
[7]: monorepo_utils.md#polyreporuncontext
[8]: monorepo_utils.md#runcontext
[9]: monorepo_utils.md#getruncontext
[10]:
  https://github.com/Xunnamius/projector/blob/5198046/packages/core/src/monorepo-utils.ts#L63
[11]:
  https://github.com/Xunnamius/projector/blob/5198046/packages/core/src/monorepo-utils.ts#L71
[12]:
  https://github.com/Xunnamius/projector/blob/5198046/packages/core/src/monorepo-utils.ts#L18
[13]:
  https://github.com/Xunnamius/projector/blob/5198046/packages/core/src/monorepo-utils.ts#L77
