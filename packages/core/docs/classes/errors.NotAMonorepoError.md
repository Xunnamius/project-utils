[@projector-js/core][1] / [errors][2] / NotAMonorepoError

# Class: NotAMonorepoError

[errors][2].NotAMonorepoError

Represents unexpectedly encountering a project that is not a monorepo.

## Hierarchy

- [`ContextError`][3]

  ↳ **`NotAMonorepoError`**

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

• **new NotAMonorepoError**()

Represents unexpectedly encountering a project that is not a monorepo.

#### Overrides

[ContextError][3].[constructor][11]

#### Defined in

[packages/core/src/errors.ts:35][12]

• **new NotAMonorepoError**(`message`)

This constructor syntax is used by subclasses when calling this constructor via
`super`.

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `message` | `string` |

#### Overrides

ContextError.constructor

#### Defined in

[packages/core/src/errors.ts:40][13]

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
[4]: errors.NotAMonorepoError.md#constructor
[5]: errors.NotAMonorepoError.md#message
[6]: errors.NotAMonorepoError.md#name
[7]: errors.NotAMonorepoError.md#stack
[8]: errors.NotAMonorepoError.md#preparestacktrace
[9]: errors.NotAMonorepoError.md#stacktracelimit
[10]: errors.NotAMonorepoError.md#capturestacktrace
[11]: errors.ContextError.md#constructor
[12]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/errors.ts#L35
[13]:
  https://github.com/Xunnamius/projector/blob/03441d9/packages/core/src/errors.ts#L40
[14]: errors.ContextError.md#message
[15]: errors.ContextError.md#name
[16]: errors.ContextError.md#stack
[17]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[18]: errors.ContextError.md#preparestacktrace
[19]: errors.ContextError.md#stacktracelimit
[20]: errors.ContextError.md#capturestacktrace
