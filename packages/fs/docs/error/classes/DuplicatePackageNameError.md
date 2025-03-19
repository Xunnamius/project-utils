[**@-xun/project-fs**](../../README.md)

***

[@-xun/project-fs](../../README.md) / [error](../README.md) / DuplicatePackageNameError

# Class: DuplicatePackageNameError

Defined in: [packages/common/src/error.ts:195](https://github.com/Xunnamius/projector/blob/7eae313be5b26fe85e1c6ce76044bc731b50b838/packages/common/src/error.ts#L195)

Represents encountering a workspace package.json file with the same `"name"`
field as another workspace.

## Extends

- [`ProjectError`](ProjectError.md)

## Constructors

### new DuplicatePackageNameError()

> **new DuplicatePackageNameError**(`packageName`, `firstPath`, `secondPath`): `DuplicatePackageNameError`

Defined in: [packages/common/src/error.ts:202](https://github.com/Xunnamius/projector/blob/7eae313be5b26fe85e1c6ce76044bc731b50b838/packages/common/src/error.ts#L202)

Represents encountering a workspace package.json file with the same
`"name"` field as another workspace.

#### Parameters

##### packageName

`string`

##### firstPath

`string`

##### secondPath

`string`

#### Returns

`DuplicatePackageNameError`

#### Overrides

[`ProjectError`](ProjectError.md).[`constructor`](ProjectError.md#constructor)

### new DuplicatePackageNameError()

> **new DuplicatePackageNameError**(`packageName`, `firstPath`, `secondPath`, `message`): `DuplicatePackageNameError`

Defined in: [packages/common/src/error.ts:207](https://github.com/Xunnamius/projector/blob/7eae313be5b26fe85e1c6ce76044bc731b50b838/packages/common/src/error.ts#L207)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

##### packageName

`string`

##### firstPath

`string`

##### secondPath

`string`

##### message

`string`

#### Returns

`DuplicatePackageNameError`

#### Overrides

[`ProjectError`](ProjectError.md).[`constructor`](ProjectError.md#constructor)

## Properties

### \[$type\]

> **\[$type\]**: `symbol`[]

Defined in: [packages/common/src/error.ts:197](https://github.com/Xunnamius/projector/blob/7eae313be5b26fe85e1c6ce76044bc731b50b838/packages/common/src/error.ts#L197)

#### Overrides

[`ProjectError`](ProjectError.md).[`[$type]`](ProjectError.md#type)

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

[`ProjectError`](ProjectError.md).[`cause`](ProjectError.md#cause)

***

### firstPath

> `readonly` **firstPath**: `string`

Defined in: [packages/common/src/error.ts:215](https://github.com/Xunnamius/projector/blob/7eae313be5b26fe85e1c6ce76044bc731b50b838/packages/common/src/error.ts#L215)

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

[`ProjectError`](ProjectError.md).[`message`](ProjectError.md#message)

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

[`ProjectError`](ProjectError.md).[`name`](ProjectError.md#name)

***

### packageName

> `readonly` **packageName**: `string`

Defined in: [packages/common/src/error.ts:214](https://github.com/Xunnamius/projector/blob/7eae313be5b26fe85e1c6ce76044bc731b50b838/packages/common/src/error.ts#L214)

***

### secondPath

> `readonly` **secondPath**: `string`

Defined in: [packages/common/src/error.ts:216](https://github.com/Xunnamius/projector/blob/7eae313be5b26fe85e1c6ce76044bc731b50b838/packages/common/src/error.ts#L216)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`ProjectError`](ProjectError.md).[`stack`](ProjectError.md#stack)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/@types/node/globals.d.ts:143

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`ProjectError`](ProjectError.md).[`prepareStackTrace`](ProjectError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`ProjectError`](ProjectError.md).[`stackTraceLimit`](ProjectError.md#stacktracelimit)

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

[`ProjectError`](ProjectError.md).[`captureStackTrace`](ProjectError.md#capturestacktrace)
