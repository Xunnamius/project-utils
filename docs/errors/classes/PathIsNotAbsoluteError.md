[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [errors](../README.md) / PathIsNotAbsoluteError

# Class: PathIsNotAbsoluteError

Represents encountering a path that is unexpectedly not absolute.

## Extends

- [`ContextError`](ContextError.md)

## Constructors

### new PathIsNotAbsoluteError()

> **new PathIsNotAbsoluteError**(`path`): [`PathIsNotAbsoluteError`](PathIsNotAbsoluteError.md)

Represents encountering a path that is unexpectedly not absolute.

#### Parameters

• **path**: `string`

#### Returns

[`PathIsNotAbsoluteError`](PathIsNotAbsoluteError.md)

#### Overrides

[`ContextError`](ContextError.md).[`constructor`](ContextError.md#constructors)

#### Source

[packages/core/src/errors.ts:16](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L16)

### new PathIsNotAbsoluteError()

> **new PathIsNotAbsoluteError**(`path`, `message`): [`PathIsNotAbsoluteError`](PathIsNotAbsoluteError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

• **path**: `string`

• **message**: `string`

#### Returns

[`PathIsNotAbsoluteError`](PathIsNotAbsoluteError.md)

#### Overrides

[`ContextError`](ContextError.md).[`constructor`](ContextError.md#constructors)

#### Source

[packages/core/src/errors.ts:21](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L21)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`ContextError`](ContextError.md).[`cause`](ContextError.md#cause)

#### Source

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

[`ContextError`](ContextError.md).[`message`](ContextError.md#message)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

[`ContextError`](ContextError.md).[`name`](ContextError.md#name)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### path

> `readonly` **path**: `string`

#### Source

[packages/core/src/errors.ts:22](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L22)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ContextError`](ContextError.md).[`stack`](ContextError.md#stack)

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

[`ContextError`](ContextError.md).[`prepareStackTrace`](ContextError.md#preparestacktrace)

#### Source

node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ContextError`](ContextError.md).[`stackTraceLimit`](ContextError.md#stacktracelimit)

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

[`ContextError`](ContextError.md).[`captureStackTrace`](ContextError.md#capturestacktrace)

#### Source

node\_modules/@types/node/globals.d.ts:21
