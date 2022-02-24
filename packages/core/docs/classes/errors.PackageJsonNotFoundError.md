[@projector-js/core][1] / [errors][2] / PackageJsonNotFoundError

# Class: PackageJsonNotFoundError

[errors][2].PackageJsonNotFoundError

Represents a failure to find a package.json file.

## Hierarchy

- [`ContextError`][3]

  ↳ **`PackageJsonNotFoundError`**

## Table of contents

### Constructors

- [constructor][4]

### Properties

- [cause][5]
- [message][6]
- [name][7]
- [stack][8]
- [prepareStackTrace][9]
- [stackTraceLimit][10]

### Methods

- [captureStackTrace][11]

## Constructors

### constructor

• **new PackageJsonNotFoundError**(`cause`)

Represents a failure to find a package.json file.

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `cause` | `unknown` |

#### Overrides

[ContextError][3].[constructor][12]

#### Defined in

packages/core/src/errors.ts:57

• **new PackageJsonNotFoundError**(`cause`, `message`)

This constructor syntax is used by subclasses when calling this constructor via
`super`.

#### Parameters

| Name      | Type      |
| :-------- | :-------- |
| `cause`   | `unknown` |
| `message` | `string`  |

#### Overrides

ContextError.constructor

#### Defined in

packages/core/src/errors.ts:62

## Properties

### cause

• `Readonly` **cause**: `unknown`

---

### message

• **message**: `string`

#### Inherited from

[ContextError][3].[message][13]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

---

### name

• **name**: `string`

#### Inherited from

[ContextError][3].[name][14]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[ContextError][3].[stack][15]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`:
`CallSite`\[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** [https://v8.dev/docs/stack-trace-api#customizing-stack-traces][16]

##### Parameters

| Name          | Type          |
| :------------ | :------------ |
| `err`         | `Error`       |
| `stackTraces` | `CallSite`\[] |

##### Returns

`any`

#### Inherited from

[ContextError][3].[prepareStackTrace][17]

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[ContextError][3].[stackTraceLimit][18]

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

[ContextError][3].[captureStackTrace][19]

#### Defined in

node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/errors.md
[3]: errors.ContextError.md
[4]: errors.PackageJsonNotFoundError.md#constructor
[5]: errors.PackageJsonNotFoundError.md#cause
[6]: errors.PackageJsonNotFoundError.md#message
[7]: errors.PackageJsonNotFoundError.md#name
[8]: errors.PackageJsonNotFoundError.md#stack
[9]: errors.PackageJsonNotFoundError.md#preparestacktrace
[10]: errors.PackageJsonNotFoundError.md#stacktracelimit
[11]: errors.PackageJsonNotFoundError.md#capturestacktrace
[12]: errors.ContextError.md#constructor
[13]: errors.ContextError.md#message
[14]: errors.ContextError.md#name
[15]: errors.ContextError.md#stack
[16]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[17]: errors.ContextError.md#preparestacktrace
[18]: errors.ContextError.md#stacktracelimit
[19]: errors.ContextError.md#capturestacktrace
