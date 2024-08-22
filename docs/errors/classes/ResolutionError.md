[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [errors](../README.md) / ResolutionError

# Class: ResolutionError

Represents an error that occurred while resolving a specifier, entry point,
path, or some other identifier.

## Extends

- `Error`

## Constructors

### new ResolutionError()

> **new ResolutionError**(`message`): [`ResolutionError`](ResolutionError.md)

Represents an error that occurred while resolving a specifier, entry point,
path, or some other identifier.

#### Parameters

• **message**: `string`

#### Returns

[`ResolutionError`](ResolutionError.md)

#### Overrides

`Error.constructor`

#### Source

[packages/core/src/errors.ts:189](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L189)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Source

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

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

`Error.prepareStackTrace`

#### Source

node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

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

`Error.captureStackTrace`

#### Source

node\_modules/@types/node/globals.d.ts:21
