[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [src/error](../README.md) / DuplicatePackageIdError

# Class: DuplicatePackageIdError

Defined in: [packages/common/src/error.ts:231](https://github.com/Xunnamius/projector/blob/b4407b9dec88e62f1f2f2b3dd1bd93f181cb7d24/packages/common/src/error.ts#L231)

Represents encountering an unnamed workspace with the same package-id as
another workspace.

## Extends

- [`ProjectError`](ProjectError.md)

## Constructors

### new DuplicatePackageIdError()

> **new DuplicatePackageIdError**(`id`, `firstPath`, `secondPath`): [`DuplicatePackageIdError`](DuplicatePackageIdError.md)

Defined in: [packages/common/src/error.ts:238](https://github.com/Xunnamius/projector/blob/b4407b9dec88e62f1f2f2b3dd1bd93f181cb7d24/packages/common/src/error.ts#L238)

Represents encountering an unnamed workspace with the same package-id as
another workspace.

#### Parameters

##### id

`string`

##### firstPath

`string`

##### secondPath

`string`

#### Returns

[`DuplicatePackageIdError`](DuplicatePackageIdError.md)

#### Overrides

[`ProjectError`](ProjectError.md).[`constructor`](ProjectError.md#constructors)

### new DuplicatePackageIdError()

> **new DuplicatePackageIdError**(`id`, `firstPath`, `secondPath`, `message`): [`DuplicatePackageIdError`](DuplicatePackageIdError.md)

Defined in: [packages/common/src/error.ts:243](https://github.com/Xunnamius/projector/blob/b4407b9dec88e62f1f2f2b3dd1bd93f181cb7d24/packages/common/src/error.ts#L243)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

##### id

`string`

##### firstPath

`string`

##### secondPath

`string`

##### message

`string`

#### Returns

[`DuplicatePackageIdError`](DuplicatePackageIdError.md)

#### Overrides

[`ProjectError`](ProjectError.md).[`constructor`](ProjectError.md#constructors)

## Properties

### \[$type\]

> **\[$type\]**: `symbol`[]

Defined in: [packages/common/src/error.ts:233](https://github.com/Xunnamius/projector/blob/b4407b9dec88e62f1f2f2b3dd1bd93f181cb7d24/packages/common/src/error.ts#L233)

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

Defined in: [packages/common/src/error.ts:246](https://github.com/Xunnamius/projector/blob/b4407b9dec88e62f1f2f2b3dd1bd93f181cb7d24/packages/common/src/error.ts#L246)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/common/src/error.ts:245](https://github.com/Xunnamius/projector/blob/b4407b9dec88e62f1f2f2b3dd1bd93f181cb7d24/packages/common/src/error.ts#L245)

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

### secondPath

> `readonly` **secondPath**: `string`

Defined in: [packages/common/src/error.ts:247](https://github.com/Xunnamius/projector/blob/b4407b9dec88e62f1f2f2b3dd1bd93f181cb7d24/packages/common/src/error.ts#L247)

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
