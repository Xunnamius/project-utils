[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [src/error](../README.md) / DuplicatePackageNameError

# Class: DuplicatePackageNameError

Defined in: [packages/common/src/error.ts:193](https://github.com/Xunnamius/projector/blob/17e0fc2cbfbba96d7aaeeb5e98ce42b294402225/packages/common/src/error.ts#L193)

Represents encountering a workspace package.json file with the same `"name"`
field as another workspace.

## Extends

- [`ProjectError`](ProjectError.md)

## Constructors

### new DuplicatePackageNameError()

> **new DuplicatePackageNameError**(`packageName`, `firstPath`, `secondPath`): [`DuplicatePackageNameError`](DuplicatePackageNameError.md)

Defined in: [packages/common/src/error.ts:200](https://github.com/Xunnamius/projector/blob/17e0fc2cbfbba96d7aaeeb5e98ce42b294402225/packages/common/src/error.ts#L200)

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

[`DuplicatePackageNameError`](DuplicatePackageNameError.md)

#### Overrides

[`ProjectError`](ProjectError.md).[`constructor`](ProjectError.md#constructors)

### new DuplicatePackageNameError()

> **new DuplicatePackageNameError**(`packageName`, `firstPath`, `secondPath`, `message`): [`DuplicatePackageNameError`](DuplicatePackageNameError.md)

Defined in: [packages/common/src/error.ts:205](https://github.com/Xunnamius/projector/blob/17e0fc2cbfbba96d7aaeeb5e98ce42b294402225/packages/common/src/error.ts#L205)

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

[`DuplicatePackageNameError`](DuplicatePackageNameError.md)

#### Overrides

[`ProjectError`](ProjectError.md).[`constructor`](ProjectError.md#constructors)

## Properties

### \[$type\]

> **\[$type\]**: `symbol`[]

Defined in: [packages/common/src/error.ts:195](https://github.com/Xunnamius/projector/blob/17e0fc2cbfbba96d7aaeeb5e98ce42b294402225/packages/common/src/error.ts#L195)

#### Overrides

[`ProjectError`](ProjectError.md).[`[$type]`](ProjectError.md#$type)

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

[`ProjectError`](ProjectError.md).[`cause`](ProjectError.md#cause)

***

### firstPath

> `readonly` **firstPath**: `string`

Defined in: [packages/common/src/error.ts:213](https://github.com/Xunnamius/projector/blob/17e0fc2cbfbba96d7aaeeb5e98ce42b294402225/packages/common/src/error.ts#L213)

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

[`ProjectError`](ProjectError.md).[`message`](ProjectError.md#message-1)

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

[`ProjectError`](ProjectError.md).[`name`](ProjectError.md#name)

***

### packageName

> `readonly` **packageName**: `string`

Defined in: [packages/common/src/error.ts:212](https://github.com/Xunnamius/projector/blob/17e0fc2cbfbba96d7aaeeb5e98ce42b294402225/packages/common/src/error.ts#L212)

***

### secondPath

> `readonly` **secondPath**: `string`

Defined in: [packages/common/src/error.ts:214](https://github.com/Xunnamius/projector/blob/17e0fc2cbfbba96d7aaeeb5e98ce42b294402225/packages/common/src/error.ts#L214)

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
