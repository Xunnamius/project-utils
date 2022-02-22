[@projector-js/core][1] / [monorepo-utils][2] / ContextError

# Class: ContextError

[monorepo-utils][2].ContextError

## Hierarchy

- `Error`

  ↳ **`ContextError`**

  ↳↳ [`NotAGitRepositoryError`][3]

  ↳↳ [`PackageJsonNotFoundError`][4]

  ↳↳ [`BadPackageJsonError`][5]

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

**`see`** [https://v8.dev/docs/stack-trace-api#customizing-stack-traces][13]

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
[2]: ../modules/monorepo_utils.md
[3]: monorepo_utils.NotAGitRepositoryError.md
[4]: monorepo_utils.PackageJsonNotFoundError.md
[5]: monorepo_utils.BadPackageJsonError.md
[6]: monorepo_utils.ContextError.md#constructor
[7]: monorepo_utils.ContextError.md#message
[8]: monorepo_utils.ContextError.md#name
[9]: monorepo_utils.ContextError.md#stack
[10]: monorepo_utils.ContextError.md#preparestacktrace
[11]: monorepo_utils.ContextError.md#stacktracelimit
[12]: monorepo_utils.ContextError.md#capturestacktrace
[13]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
