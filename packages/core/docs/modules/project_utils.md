[@projector-js/core][1] / project-utils

# Module: project-utils

## Table of contents

### Type aliases

- [MonorepoRunContext][2]
- [PolyrepoRunContext][3]
- [RootPackage][4]
- [RunContext][5]
- [WorkspacePackage][6]
- [WorkspacePackageName][7]

### Functions

- [clearPackageJsonCache][8]
- [getRunContext][9]
- [getWorkspacePackages][10]
- [packageRootToId][11]
- [readPackageJson][12]

## Type aliases

### MonorepoRunContext

Ƭ **MonorepoRunContext**: [`RunContext`][5] & { `context`: `"monorepo"` ;
`project`: [`RootPackage`][4] & { `packages`:
`NonNullable`<[`RootPackage`][4]\[`"packages"`]> } }

An object representing a monorepo runtime context.

#### Defined in

[packages/core/src/project-utils.ts:91][13]

---

### PolyrepoRunContext

Ƭ **PolyrepoRunContext**: [`RunContext`][5] & { `context`: `"polyrepo"` ;
`package`: `null` ; `project`: [`RootPackage`][4] & { `packages`: `null` } }

An object representing a polyrepo runtime context.

#### Defined in

[packages/core/src/project-utils.ts:101][14]

---

### RootPackage

Ƭ **RootPackage**: `Object`

An object representing the root or "top-level" package in a monorepo or polyrepo
project.

#### Type declaration

| Name       | Type                                                                                                                                               | Description                                                                                   |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `json`     | `PackageJson`                                                                                                                                      | The contents of the root package's package.json file.                                         |
| `packages` | `Map`<[`WorkspacePackageName`][7], [`WorkspacePackage`][6]> & { `unnamed`: `Map`<[`WorkspacePackageName`][7], [`WorkspacePackage`][6]> } \| `null` | A mapping of package names to WorkspacePackage objects in a monorepo or `null` in a polyrepo. |
| `root`     | `string`                                                                                                                                           | The absolute path to the root directory of the entire project.                                |

#### Defined in

[packages/core/src/project-utils.ts:26][15]

---

### RunContext

Ƭ **RunContext**: `Object`

An object representing a runtime context.

#### Type declaration

| Name      | Type                              | Description                                                                                                                                                                             |
| :-------- | :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context` | `"monorepo"` \| `"polyrepo"`      | Whether node is executing in a monorepo or a polyrepo context.                                                                                                                          |
| `package` | [`WorkspacePackage`][6] \| `null` | An object representing the current package (determined by cwd) in a monorepo context, or `null` in a polyrepo context or when cwd is not within any package root in a monorepo context. |
| `project` | [`RootPackage`][4]                | Repository root package data.                                                                                                                                                           |

#### Defined in

[packages/core/src/project-utils.ts:71][16]

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

[packages/core/src/project-utils.ts:53][17]

---

### WorkspacePackageName

Ƭ **WorkspacePackageName**: `string`

#### Defined in

[packages/core/src/project-utils.ts:20][18]

## Functions

### clearPackageJsonCache

▸ **clearPackageJsonCache**(): `void`

Clear the cache that memoizes the `readPackageJson` function results. Primarily
useful for testing purposes.

#### Returns

`void`

#### Defined in

[packages/core/src/project-utils.ts:126][19]

---

### getRunContext

▸ **getRunContext**(`options?`): [`MonorepoRunContext`][2] |
[`PolyrepoRunContext`][3]

Returns information about the project structure at the current working
directory.

#### Parameters

| Name           | Type     | Description                                                                                                                               |
| :------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `options`      | `Object` | -                                                                                                                                         |
| `options.cwd?` | `string` | The current working directory as an absolute path. Supplying a relative path will lead to undefined behavior. **`default`** process.cwd() |

#### Returns

[`MonorepoRunContext`][2] | [`PolyrepoRunContext`][3]

#### Defined in

[packages/core/src/project-utils.ts:309][20]

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

| Name         | Type                                                                                               |
| :----------- | :------------------------------------------------------------------------------------------------- |
| `cwdPackage` | `null` \| [`WorkspacePackage`][6]                                                                  |
| `packages`   | `Map`<`string`, [`WorkspacePackage`][6]> & { `unnamed`: `Map`<`string`, [`WorkspacePackage`][6]> } |

#### Defined in

[packages/core/src/project-utils.ts:169][21]

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

[packages/core/src/project-utils.ts:110][22]

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

[packages/core/src/project-utils.ts:133][23]

[1]: ../README.md
[2]: project_utils.md#monoreporuncontext
[3]: project_utils.md#polyreporuncontext
[4]: project_utils.md#rootpackage
[5]: project_utils.md#runcontext
[6]: project_utils.md#workspacepackage
[7]: project_utils.md#workspacepackagename
[8]: project_utils.md#clearpackagejsoncache
[9]: project_utils.md#getruncontext
[10]: project_utils.md#getworkspacepackages
[11]: project_utils.md#packageroottoid
[12]: project_utils.md#readpackagejson
[13]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L91
[14]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L101
[15]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L26
[16]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L71
[17]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L53
[18]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L20
[19]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L126
[20]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L309
[21]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L169
[22]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L110
[23]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/project-utils.ts#L133
