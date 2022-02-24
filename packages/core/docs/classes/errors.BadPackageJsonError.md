[@projector-js/core][1] / [errors][2] / BadPackageJsonError

# Class: BadPackageJsonError

[errors][2].BadPackageJsonError

Represents encountering an unparsable package.json file.

## Hierarchy

- [`ContextError`][3]

  ↳ **`BadPackageJsonError`**

## Table of contents

### Constructors

- [constructor][4]

### Properties

- [cause][5]
- [message][6]
- [name][7]
- [packageJsonPath][8]
- [stack][9]
- [prepareStackTrace][10]
- [stackTraceLimit][11]

### Methods

- [captureStackTrace][12]

## Constructors

### constructor

• **new BadPackageJsonError**(`packageJsonPath`, `cause`)

Represents encountering an unparsable package.json file.

#### Parameters

| Name              | Type      |
| :---------------- | :-------- |
| `packageJsonPath` | `string`  |
| `cause`           | `unknown` |

#### Overrides

[ContextError][3].[constructor][13]

#### Defined in

[packages/core/src/errors.ts:76][14]

• **new BadPackageJsonError**(`packageJsonPath`, `cause`, `message`)

This constructor syntax is used by subclasses when calling this constructor via
`super`.

#### Parameters

| Name              | Type      |
| :---------------- | :-------- |
| `packageJsonPath` | `string`  |
| `cause`           | `unknown` |
| `message`         | `string`  |

#### Overrides

ContextError.constructor

#### Defined in

[packages/core/src/errors.ts:81][15]

## Properties

### cause

• `Readonly` **cause**: `unknown`

---

### message

• **message**: `string`

#### Inherited from

[ContextError][3].[message][16]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

---

### name

• **name**: `string`

#### Inherited from

[ContextError][3].[name][17]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

---

### packageJsonPath

• `Readonly` **packageJsonPath**: `string`

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[ContextError][3].[stack][18]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`:
`CallSite`\[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** [https://v8.dev/docs/stack-trace-api#customizing-stack-traces][19]

##### Parameters

| Name          | Type          |
| :------------ | :------------ |
| `err`         | `Error`       |
| `stackTraces` | `CallSite`\[] |

##### Returns

`any`

#### Inherited from

[ContextError][3].[prepareStackTrace][20]

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[ContextError][3].[stackTraceLimit][21]

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

[ContextError][3].[captureStackTrace][22]

#### Defined in

node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/errors.md
[3]: errors.ContextError.md
[4]: errors.BadPackageJsonError.md#constructor
[5]: errors.BadPackageJsonError.md#cause
[6]: errors.BadPackageJsonError.md#message
[7]: errors.BadPackageJsonError.md#name
[8]: errors.BadPackageJsonError.md#packagejsonpath
[9]: errors.BadPackageJsonError.md#stack
[10]: errors.BadPackageJsonError.md#preparestacktrace
[11]: errors.BadPackageJsonError.md#stacktracelimit
[12]: errors.BadPackageJsonError.md#capturestacktrace
[13]: errors.ContextError.md#constructor
[14]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/errors.ts#L76
[15]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/errors.ts#L81
[16]: errors.ContextError.md#message
[17]: errors.ContextError.md#name
[18]: errors.ContextError.md#stack
[19]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[20]: errors.ContextError.md#preparestacktrace
[21]: errors.ContextError.md#stacktracelimit
[22]: errors.ContextError.md#capturestacktrace
