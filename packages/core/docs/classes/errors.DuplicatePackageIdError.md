[@projector-js/core][1] / [errors][2] / DuplicatePackageIdError

# Class: DuplicatePackageIdError

[errors][2].DuplicatePackageIdError

Represents encountering an unnamed workspace with the same package-id as another
workspace.

## Hierarchy

- [`DuplicateWorkspaceError`][3]

  ↳ **`DuplicatePackageIdError`**

## Table of contents

### Constructors

- [constructor][4]

### Properties

- [firstPath][5]
- [id][6]
- [message][7]
- [name][8]
- [secondPath][9]
- [stack][10]
- [prepareStackTrace][11]
- [stackTraceLimit][12]

### Methods

- [captureStackTrace][13]

## Constructors

### constructor

• **new DuplicatePackageIdError**(`id`, `firstPath`, `secondPath`)

Represents encountering an unnamed workspace with the same package-id as another
workspace.

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `id`         | `string` |
| `firstPath`  | `string` |
| `secondPath` | `string` |

#### Overrides

[DuplicateWorkspaceError][3].[constructor][14]

#### Defined in

packages/core/src/errors.ts:139

• **new DuplicatePackageIdError**(`id`, `firstPath`, `secondPath`, `message`)

This constructor syntax is used by subclasses when calling this constructor via
`super`.

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `id`         | `string` |
| `firstPath`  | `string` |
| `secondPath` | `string` |
| `message`    | `string` |

#### Overrides

DuplicateWorkspaceError.constructor

#### Defined in

packages/core/src/errors.ts:144

## Properties

### firstPath

• `Readonly` **firstPath**: `string`

---

### id

• `Readonly` **id**: `string`

---

### message

• **message**: `string`

#### Inherited from

[DuplicateWorkspaceError][3].[message][15]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

---

### name

• **name**: `string`

#### Inherited from

[DuplicateWorkspaceError][3].[name][16]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

---

### secondPath

• `Readonly` **secondPath**: `string`

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[DuplicateWorkspaceError][3].[stack][17]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`:
`CallSite`\[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** [https://v8.dev/docs/stack-trace-api#customizing-stack-traces][18]

##### Parameters

| Name          | Type          |
| :------------ | :------------ |
| `err`         | `Error`       |
| `stackTraces` | `CallSite`\[] |

##### Returns

`any`

#### Inherited from

[DuplicateWorkspaceError][3].[prepareStackTrace][19]

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[DuplicateWorkspaceError][3].[stackTraceLimit][20]

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

[DuplicateWorkspaceError][3].[captureStackTrace][21]

#### Defined in

node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/errors.md
[3]: errors.DuplicateWorkspaceError.md
[4]: errors.DuplicatePackageIdError.md#constructor
[5]: errors.DuplicatePackageIdError.md#firstpath
[6]: errors.DuplicatePackageIdError.md#id
[7]: errors.DuplicatePackageIdError.md#message
[8]: errors.DuplicatePackageIdError.md#name
[9]: errors.DuplicatePackageIdError.md#secondpath
[10]: errors.DuplicatePackageIdError.md#stack
[11]: errors.DuplicatePackageIdError.md#preparestacktrace
[12]: errors.DuplicatePackageIdError.md#stacktracelimit
[13]: errors.DuplicatePackageIdError.md#capturestacktrace
[14]: errors.DuplicateWorkspaceError.md#constructor
[15]: errors.DuplicateWorkspaceError.md#message
[16]: errors.DuplicateWorkspaceError.md#name
[17]: errors.DuplicateWorkspaceError.md#stack
[18]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[19]: errors.DuplicateWorkspaceError.md#preparestacktrace
[20]: errors.DuplicateWorkspaceError.md#stacktracelimit
[21]: errors.DuplicateWorkspaceError.md#capturestacktrace
