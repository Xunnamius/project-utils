[@projector-js/core][1] / [errors][2] / ContextError

# Class: ContextError

[errors][2].ContextError

Represents an exception during context resolution.

## Hierarchy

- `Error`

  ↳ **`ContextError`**

  ↳↳ [`NotAGitRepositoryError`][3]

  ↳↳ [`NotAMonorepoError`][4]

  ↳↳ [`PackageJsonNotFoundError`][5]

  ↳↳ [`BadPackageJsonError`][6]

  ↳↳ [`DuplicateWorkspaceError`][7]

## Table of contents

### Constructors

- [constructor][8]

### Properties

- [message][9]
- [name][10]
- [stack][11]
- [prepareStackTrace][12]
- [stackTraceLimit][13]

### Methods

- [captureStackTrace][14]

## Constructors

### constructor

• **new ContextError**(`message?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1028

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

---

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

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

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

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

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/errors.md
[3]: errors.NotAGitRepositoryError.md
[4]: errors.NotAMonorepoError.md
[5]: errors.PackageJsonNotFoundError.md
[6]: errors.BadPackageJsonError.md
[7]: errors.DuplicateWorkspaceError.md
[8]: errors.ContextError.md#constructor
[9]: errors.ContextError.md#message
[10]: errors.ContextError.md#name
[11]: errors.ContextError.md#stack
[12]: errors.ContextError.md#preparestacktrace
[13]: errors.ContextError.md#stacktracelimit
[14]: errors.ContextError.md#capturestacktrace
[15]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
