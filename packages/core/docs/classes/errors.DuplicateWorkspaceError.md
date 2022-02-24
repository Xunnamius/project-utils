[@projector-js/core][1] / [errors][2] / DuplicateWorkspaceError

# Class: DuplicateWorkspaceError

[errors][2].DuplicateWorkspaceError

Represents encountering two or more workspaces that cannot be differentiated
from each other.

## Hierarchy

- [`ContextError`][3]

  ↳ **`DuplicateWorkspaceError`**

  ↳↳ [`DuplicatePackageNameError`][4]

  ↳↳ [`DuplicatePackageIdError`][5]

## Table of contents

### Constructors

- [constructor][6]

### Properties

- [message][7]
- [name][8]
- [stack][9]
- [prepareStackTrace][10]
- [stackTraceLimit][11]

### Methods

- [captureStackTrace][12]

## Constructors

### constructor

• **new DuplicateWorkspaceError**(`message?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message?` | `string` |

#### Inherited from

[ContextError][3].[constructor][13]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1028

## Properties

### message

• **message**: `string`

#### Inherited from

[ContextError][3].[message][14]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

---

### name

• **name**: `string`

#### Inherited from

[ContextError][3].[name][15]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[ContextError][3].[stack][16]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`:
`CallSite`\[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** [https://v8.dev/docs/stack-trace-api#customizing-stack-traces][17]

##### Parameters

| Name          | Type          |
| :------------ | :------------ |
| `err`         | `Error`       |
| `stackTraces` | `CallSite`\[] |

##### Returns

`any`

#### Inherited from

[ContextError][3].[prepareStackTrace][18]

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[ContextError][3].[stackTraceLimit][19]

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

[ContextError][3].[captureStackTrace][20]

#### Defined in

node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/errors.md
[3]: errors.ContextError.md
[4]: errors.DuplicatePackageNameError.md
[5]: errors.DuplicatePackageIdError.md
[6]: errors.DuplicateWorkspaceError.md#constructor
[7]: errors.DuplicateWorkspaceError.md#message
[8]: errors.DuplicateWorkspaceError.md#name
[9]: errors.DuplicateWorkspaceError.md#stack
[10]: errors.DuplicateWorkspaceError.md#preparestacktrace
[11]: errors.DuplicateWorkspaceError.md#stacktracelimit
[12]: errors.DuplicateWorkspaceError.md#capturestacktrace
[13]: errors.ContextError.md#constructor
[14]: errors.ContextError.md#message
[15]: errors.ContextError.md#name
[16]: errors.ContextError.md#stack
[17]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[18]: errors.ContextError.md#preparestacktrace
[19]: errors.ContextError.md#stacktracelimit
[20]: errors.ContextError.md#capturestacktrace
