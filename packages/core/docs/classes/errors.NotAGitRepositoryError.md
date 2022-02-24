[@projector-js/core][1] / [errors][2] / NotAGitRepositoryError

# Class: NotAGitRepositoryError

[errors][2].NotAGitRepositoryError

Represents encountering a project that is not a git repository.

## Hierarchy

- [`ContextError`][3]

  ↳ **`NotAGitRepositoryError`**

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

• **new NotAGitRepositoryError**()

Represents encountering a project that is not a git repository.

#### Overrides

[ContextError][3].[constructor][11]

#### Defined in

packages/core/src/errors.ts:16

• **new NotAGitRepositoryError**(`message`)

This constructor syntax is used by subclasses when calling this constructor via
`super`.

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `message` | `string` |

#### Overrides

ContextError.constructor

#### Defined in

packages/core/src/errors.ts:21

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
[2]: ../modules/errors.md
[3]: errors.ContextError.md
[4]: errors.NotAGitRepositoryError.md#constructor
[5]: errors.NotAGitRepositoryError.md#message
[6]: errors.NotAGitRepositoryError.md#name
[7]: errors.NotAGitRepositoryError.md#stack
[8]: errors.NotAGitRepositoryError.md#preparestacktrace
[9]: errors.NotAGitRepositoryError.md#stacktracelimit
[10]: errors.NotAGitRepositoryError.md#capturestacktrace
[11]: errors.ContextError.md#constructor
[12]: errors.ContextError.md#message
[13]: errors.ContextError.md#name
[14]: errors.ContextError.md#stack
[15]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[16]: errors.ContextError.md#preparestacktrace
[17]: errors.ContextError.md#stacktracelimit
[18]: errors.ContextError.md#capturestacktrace
