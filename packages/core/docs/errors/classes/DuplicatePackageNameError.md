[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [errors](../README.md) / DuplicatePackageNameError

# Class: DuplicatePackageNameError

Represents encountering a workspace package.json file with the same `"name"`
field as another workspace.

## Extends

- [`DuplicateWorkspaceError`](DuplicateWorkspaceError.md)

## Constructors

### new DuplicatePackageNameError()

> **new DuplicatePackageNameError**(`pkgName`, `firstPath`, `secondPath`): [`DuplicatePackageNameError`](DuplicatePackageNameError.md)

Represents encountering a workspace package.json file with the same
`"name"` field as another workspace.

#### Parameters

• **pkgName**: `string`

• **firstPath**: `string`

• **secondPath**: `string`

#### Returns

[`DuplicatePackageNameError`](DuplicatePackageNameError.md)

#### Overrides

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`constructor`](DuplicateWorkspaceError.md#constructors)

#### Source

[packages/core/src/errors.ts:127](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L127)

### new DuplicatePackageNameError()

> **new DuplicatePackageNameError**(`pkgName`, `firstPath`, `secondPath`, `message`): [`DuplicatePackageNameError`](DuplicatePackageNameError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

• **pkgName**: `string`

• **firstPath**: `string`

• **secondPath**: `string`

• **message**: `string`

#### Returns

[`DuplicatePackageNameError`](DuplicatePackageNameError.md)

#### Overrides

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`constructor`](DuplicateWorkspaceError.md#constructors)

#### Source

[packages/core/src/errors.ts:132](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L132)

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

[packages/core/src/errors.ts:135](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L135)

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

### pkgName

> `readonly` **pkgName**: `string`

#### Source

[packages/core/src/errors.ts:134](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L134)

***

### secondPath

> `readonly` **secondPath**: `string`

#### Source

[packages/core/src/errors.ts:136](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/errors.ts#L136)

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
