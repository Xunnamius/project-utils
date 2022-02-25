[@projector-js/core][1] / project-utils

# Module: project-utils

## Table of contents

### Type aliases

- [AbsolutePath][2]
- [MonorepoRunContext][3]
- [PolyrepoRunContext][4]
- [RootPackage][5]
- [RunContext][6]
- [WorkspacePackage][7]
- [WorkspacePackageName][8]

### Functions

- [clearPackageJsonCache][9]
- [getRunContext][10]
- [getWorkspacePackages][11]
- [packageRootToId][12]
- [readPackageJson][13]

## Type aliases

### AbsolutePath

Ƭ **AbsolutePath**: `string`

#### Defined in

[packages/core/src/project-utils.ts:21][14]

---

### MonorepoRunContext

Ƭ **MonorepoRunContext**: [`RunContext`][6] & { `context`: `"monorepo"` ;
`project`: [`RootPackage`][5] & { `packages`:
`NonNullable`<[`RootPackage`][5]\[`"packages"`]> } }

An object representing a monorepo runtime context.

#### Defined in

[packages/core/src/project-utils.ts:97][15]

---

### PolyrepoRunContext

Ƭ **PolyrepoRunContext**: [`RunContext`][6] & { `context`: `"polyrepo"` ;
`package`: `null` ; `project`: [`RootPackage`][5] & { `packages`: `null` } }

An object representing a polyrepo runtime context.

#### Defined in

[packages/core/src/project-utils.ts:107][16]

---

### RootPackage

Ƭ **RootPackage**: `Object`

An object representing the root or "top-level" package in a monorepo or polyrepo
project.

#### Type declaration

| Name       | Type                                                                                                                                                                                  | Description                                                                                   |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------- |
| `json`     | `PackageJson`                                                                                                                                                                         | The contents of the root package's package.json file.                                         |
| `packages` | `Map`<[`WorkspacePackageName`][8], [`WorkspacePackage`][7]> & { `broken`: [`AbsolutePath`][2]\[] ; `unnamed`: `Map`<[`WorkspacePackageName`][8], [`WorkspacePackage`][7]> } \| `null` | A mapping of package names to WorkspacePackage objects in a monorepo or `null` in a polyrepo. |
| `root`     | `string`                                                                                                                                                                              | The absolute path to the root directory of the entire project.                                |

#### Defined in

[packages/core/src/project-utils.ts:27][17]

---

### RunContext

Ƭ **RunContext**: `Object`

An object representing a runtime context.

#### Type declaration

| Name      | Type                              | Description                                                                                                                                                                             |
| :-------- | :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context` | `"monorepo"` \| `"polyrepo"`      | Whether node is executing in a monorepo or a polyrepo context.                                                                                                                          |
| `package` | [`WorkspacePackage`][7] \| `null` | An object representing the current package (determined by cwd) in a monorepo context, or `null` in a polyrepo context or when cwd is not within any package root in a monorepo context. |
| `project` | [`RootPackage`][5]                | Repository root package data.                                                                                                                                                           |

#### Defined in

[packages/core/src/project-utils.ts:77][18]

---

### WorkspacePackage

Ƭ **WorkspacePackage**: `Object`

An object representing a package in a monorepo project.

#### Type declaration

| Name   | Type          | Description                                             |
| :----- | :------------ | :------------------------------------------------------ |
| `id`   | `string`      | The so-called "package-id" of the workspace package.    |
| `json` | `PackageJson` | The contents of the package's package.json file.        |
| `root` | `string`      | The absolute path to the root directory of the package. |

#### Defined in

[packages/core/src/project-utils.ts:59][19]

---

### WorkspacePackageName

Ƭ **WorkspacePackageName**: `string`

#### Defined in

[packages/core/src/project-utils.ts:20][20]

## Functions

### clearPackageJsonCache

▸ **clearPackageJsonCache**(): `void`

Clear the cache that memoizes the `readPackageJson` function results. Primarily
useful for testing purposes.

#### Returns

`void`

#### Defined in

[packages/core/src/project-utils.ts:132][21]

---

### getRunContext

▸ **getRunContext**(`options?`): [`MonorepoRunContext`][3] |
[`PolyrepoRunContext`][4]

Returns information about the project structure at the current working
directory.

#### Parameters

| Name           | Type     | Description                                                                                                                               |
| :------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `options`      | `Object` | -                                                                                                                                         |
| `options.cwd?` | `string` | The current working directory as an absolute path. Supplying a relative path will lead to undefined behavior. **`default`** process.cwd() |

#### Returns

[`MonorepoRunContext`][3] | [`PolyrepoRunContext`][4]

#### Defined in

[packages/core/src/project-utils.ts:318][22]

---

### getWorkspacePackages

▸ **getWorkspacePackages**(`options`): `Object`

Analyzes a monorepo context (at `cwd`), returning a mapping of package names to
workspace information.

#### Parameters

| Name                   | Type       | Description                                                                                                                                                                  |
| :--------------------- | :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`              | `Object`   | -                                                                                                                                                                            |
| `options.cwd?`         | `string`   | The current working directory as an absolute path. Supplying a relative path or a path outside of `projectRoot` will lead to undefined behavior. **`default`** process.cwd() |
| `options.globOptions?` | `IOptions` | Options passed through to node-glob and minimatch. **`default`** {}                                                                                                          |
| `options.projectRoot`  | `string`   | The absolute path to the root directory of a project. Supplying a relative path will lead to undefined behavior.                                                             |

#### Returns

`Object`

| Name         | Type                                                                                                                       |
| :----------- | :------------------------------------------------------------------------------------------------------------------------- |
| `cwdPackage` | `null` \| [`WorkspacePackage`][7]                                                                                          |
| `packages`   | `Map`<`string`, [`WorkspacePackage`][7]> & { `broken`: `string`\[] ; `unnamed`: `Map`<`string`, [`WorkspacePackage`][7]> } |

#### Defined in

[packages/core/src/project-utils.ts:175][23]

---

### packageRootToId

▸ **packageRootToId**(`(destructured)`): `string`

Determine the package-id of a package from its root directory path.

#### Parameters

| Name                | Type     | Description                                                                                                      |
| :------------------ | :------- | :--------------------------------------------------------------------------------------------------------------- |
| `(destructured)`    | `Object` | -                                                                                                                |
| `({ packageRoot })` | `string` | The absolute path to the root directory of a package. Supplying a relative path will lead to undefined behavior. |

#### Returns

`string`

#### Defined in

[packages/core/src/project-utils.ts:116][24]

---

### readPackageJson

▸ **readPackageJson**(`(destructured)`): `PackageJson`

Read in and parse the contents of a package.json file, memoizing the result.

#### Parameters

| Name                | Type     | Description                                                                                                                                                |
| :------------------ | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `(destructured)`    | `Object` | -                                                                                                                                                          |
| `({ packageRoot })` | `string` | The absolute path to the root directory of a package. `${packageRoot}/package.json` must exist. Supplying a relative path will lead to undefined behavior. |

#### Returns

`PackageJson`

#### Defined in

[packages/core/src/project-utils.ts:139][25]

[1]: ../README.md
[2]: project_utils.md#absolutepath
[3]: project_utils.md#monoreporuncontext
[4]: project_utils.md#polyreporuncontext
[5]: project_utils.md#rootpackage
[6]: project_utils.md#runcontext
[7]: project_utils.md#workspacepackage
[8]: project_utils.md#workspacepackagename
[9]: project_utils.md#clearpackagejsoncache
[10]: project_utils.md#getruncontext
[11]: project_utils.md#getworkspacepackages
[12]: project_utils.md#packageroottoid
[13]: project_utils.md#readpackagejson
[14]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L21
[15]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L97
[16]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L107
[17]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L27
[18]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L77
[19]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L59
[20]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L20
[21]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L132
[22]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L318
[23]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L175
[24]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L116
[25]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/project-utils.ts#L139
