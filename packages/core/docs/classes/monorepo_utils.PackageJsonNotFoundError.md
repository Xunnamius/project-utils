[@projector-js/core][1] / [monorepo-utils][2] / PackageJsonNotFoundError

# Class: PackageJsonNotFoundError

[monorepo-utils][2].PackageJsonNotFoundError

## Hierarchy

- [`ContextError`][3]

  ↳ **`PackageJsonNotFoundError`**

## Table of contents

### Constructors

- [constructor][4]

### Properties

- [message][5]
- [name][6]
- [stack][7]
- [prepareStackTrace][8]
- [stackTraceLimit][9]

### Methods

- [captureStackTrace][10]

## Constructors

### constructor

• **new PackageJsonNotFoundError**(`message?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message?` | `string` |

#### Inherited from

[ContextError][3].[constructor][11]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1028

## Properties

### message

• **message**: `string`

#### Inherited from

[ContextError][3].[message][12]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

---

### name

• **name**: `string`

#### Inherited from

[ContextError][3].[name][13]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[ContextError][3].[stack][14]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`:
`CallSite`\[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** [https://v8.dev/docs/stack-trace-api#customizing-stack-traces][15]

##### Parameters

| Name          | Type          |
| :------------ | :------------ |
| `err`         | `Error`       |
| `stackTraces` | `CallSite`\[] |

##### Returns

`any`

#### Inherited from

[ContextError][3].[prepareStackTrace][16]

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[ContextError][3].[stackTraceLimit][17]

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

[ContextError][3].[captureStackTrace][18]

#### Defined in

node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/monorepo_utils.md
[3]: monorepo_utils.ContextError.md
[4]: monorepo_utils.PackageJsonNotFoundError.md#constructor
[5]: monorepo_utils.PackageJsonNotFoundError.md#message
[6]: monorepo_utils.PackageJsonNotFoundError.md#name
[7]: monorepo_utils.PackageJsonNotFoundError.md#stack
[8]: monorepo_utils.PackageJsonNotFoundError.md#preparestacktrace
[9]: monorepo_utils.PackageJsonNotFoundError.md#stacktracelimit
[10]: monorepo_utils.PackageJsonNotFoundError.md#capturestacktrace
[11]: monorepo_utils.ContextError.md#constructor
[12]: monorepo_utils.ContextError.md#message
[13]: monorepo_utils.ContextError.md#name
[14]: monorepo_utils.ContextError.md#stack
[15]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[16]: monorepo_utils.ContextError.md#preparestacktrace
[17]: monorepo_utils.ContextError.md#stacktracelimit
[18]: monorepo_utils.ContextError.md#capturestacktrace
