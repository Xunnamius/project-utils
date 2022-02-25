[@projector-js/core][1] / [errors][2] / DuplicatePackageNameError

# Class: DuplicatePackageNameError

[errors][2].DuplicatePackageNameError

Represents encountering a workspace package.json file with the same `"name"`
field as another workspace.

## Hierarchy

- [`DuplicateWorkspaceError`][3]

  ↳ **`DuplicatePackageNameError`**

## Table of contents

### Constructors

- [constructor][4]

### Properties

- [firstPath][5]
- [message][6]
- [name][7]
- [pkgName][8]
- [secondPath][9]
- [stack][10]
- [prepareStackTrace][11]
- [stackTraceLimit][12]

### Methods

- [captureStackTrace][13]

## Constructors

### constructor

• **new DuplicatePackageNameError**(`pkgName`, `firstPath`, `secondPath`)

Represents encountering a workspace package.json file with the same `"name"`
field as another workspace.

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `pkgName`    | `string` |
| `firstPath`  | `string` |
| `secondPath` | `string` |

#### Overrides

[DuplicateWorkspaceError][3].[constructor][14]

#### Defined in

[packages/core/src/errors.ts:108][15]

• **new DuplicatePackageNameError**(`pkgName`, `firstPath`, `secondPath`,
`message`)

This constructor syntax is used by subclasses when calling this constructor via
`super`.

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `pkgName`    | `string` |
| `firstPath`  | `string` |
| `secondPath` | `string` |
| `message`    | `string` |

#### Overrides

DuplicateWorkspaceError.constructor

#### Defined in

[packages/core/src/errors.ts:113][16]

## Properties

### firstPath

• `Readonly` **firstPath**: `string`

---

### message

• **message**: `string`

#### Inherited from

[DuplicateWorkspaceError][3].[message][17]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

---

### name

• **name**: `string`

#### Inherited from

[DuplicateWorkspaceError][3].[name][18]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

---

### pkgName

• `Readonly` **pkgName**: `string`

---

### secondPath

• `Readonly` **secondPath**: `string`

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[DuplicateWorkspaceError][3].[stack][19]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`:
`CallSite`\[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** [https://v8.dev/docs/stack-trace-api#customizing-stack-traces][20]

##### Parameters

| Name          | Type          |
| :------------ | :------------ |
| `err`         | `Error`       |
| `stackTraces` | `CallSite`\[] |

##### Returns

`any`

#### Inherited from

[DuplicateWorkspaceError][3].[prepareStackTrace][21]

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[DuplicateWorkspaceError][3].[stackTraceLimit][22]

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `targetObject`    | `object`   |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[DuplicateWorkspaceError][3].[captureStackTrace][23]

#### Defined in

node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/errors.md
[3]: errors.DuplicateWorkspaceError.md
[4]: errors.DuplicatePackageNameError.md#constructor
[5]: errors.DuplicatePackageNameError.md#firstpath
[6]: errors.DuplicatePackageNameError.md#message
[7]: errors.DuplicatePackageNameError.md#name
[8]: errors.DuplicatePackageNameError.md#pkgname
[9]: errors.DuplicatePackageNameError.md#secondpath
[10]: errors.DuplicatePackageNameError.md#stack
[11]: errors.DuplicatePackageNameError.md#preparestacktrace
[12]: errors.DuplicatePackageNameError.md#stacktracelimit
[13]: errors.DuplicatePackageNameError.md#capturestacktrace
[14]: errors.DuplicateWorkspaceError.md#constructor
[15]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/errors.ts#L108
[16]:
  https://github.com/Xunnamius/projector/blob/874a1da/packages/core/src/errors.ts#L113
[17]: errors.DuplicateWorkspaceError.md#message
[18]: errors.DuplicateWorkspaceError.md#name
[19]: errors.DuplicateWorkspaceError.md#stack
[20]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[21]: errors.DuplicateWorkspaceError.md#preparestacktrace
[22]: errors.DuplicateWorkspaceError.md#stacktracelimit
[23]: errors.DuplicateWorkspaceError.md#capturestacktrace
