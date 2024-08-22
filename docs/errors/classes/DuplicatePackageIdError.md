[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [errors](../README.md) / DuplicatePackageIdError

# Class: DuplicatePackageIdError

Represents encountering an unnamed workspace with the same package-id as
another workspace.

## Extends

- [`DuplicateWorkspaceError`](DuplicateWorkspaceError.md)

## Constructors

### new DuplicatePackageIdError()

> **new DuplicatePackageIdError**(`id`, `firstPath`, `secondPath`): [`DuplicatePackageIdError`](DuplicatePackageIdError.md)

Represents encountering an unnamed workspace with the same package-id as
another workspace.

#### Parameters

• **id**: `string`

• **firstPath**: `string`

• **secondPath**: `string`

#### Returns

[`DuplicatePackageIdError`](DuplicatePackageIdError.md)

#### Overrides

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`constructor`](DuplicateWorkspaceError.md#constructors)

#### Source

[packages/core/src/errors.ts:158](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L158)

### new DuplicatePackageIdError()

> **new DuplicatePackageIdError**(`id`, `firstPath`, `secondPath`, `message`): [`DuplicatePackageIdError`](DuplicatePackageIdError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

• **id**: `string`

• **firstPath**: `string`

• **secondPath**: `string`

• **message**: `string`

#### Returns

[`DuplicatePackageIdError`](DuplicatePackageIdError.md)

#### Overrides

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`constructor`](DuplicateWorkspaceError.md#constructors)

#### Source

[packages/core/src/errors.ts:163](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L163)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`cause`](DuplicateWorkspaceError.md#cause)

#### Source

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### firstPath

> `readonly` **firstPath**: `string`

#### Source

[packages/core/src/errors.ts:166](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L166)

***

### id

> `readonly` **id**: `string`

#### Source

[packages/core/src/errors.ts:165](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L165)

***

### message

> **message**: `string`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`message`](DuplicateWorkspaceError.md#message)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`name`](DuplicateWorkspaceError.md#name)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### secondPath

> `readonly` **secondPath**: `string`

#### Source

[packages/core/src/errors.ts:167](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L167)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`stack`](DuplicateWorkspaceError.md#stack)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`prepareStackTrace`](DuplicateWorkspaceError.md#preparestacktrace)

#### Source

node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`stackTraceLimit`](DuplicateWorkspaceError.md#stacktracelimit)

#### Source

node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`captureStackTrace`](DuplicateWorkspaceError.md#capturestacktrace)

#### Source

node\_modules/@types/node/globals.d.ts:21
