[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [src/error](../README.md) / XPackageJsonNotParsableError

# Class: XPackageJsonNotParsableError

Defined in: [packages/common/src/error.ts:167](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/common/src/error.ts#L167)

Represents encountering an unparsable package.json file in an
symbiote-powered project.

## Extends

- [`ProjectError`](ProjectError.md)

## Constructors

### new XPackageJsonNotParsableError()

> **new XPackageJsonNotParsableError**(`packageJsonPath`, `reason`): [`XPackageJsonNotParsableError`](XPackageJsonNotParsableError.md)

Defined in: [packages/common/src/error.ts:173](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/common/src/error.ts#L173)

Represents encountering an unparsable package.json file.

#### Parameters

##### packageJsonPath

`string`

##### reason

`unknown`

#### Returns

[`XPackageJsonNotParsableError`](XPackageJsonNotParsableError.md)

#### Overrides

[`ProjectError`](ProjectError.md).[`constructor`](ProjectError.md#constructors)

### new XPackageJsonNotParsableError()

> **new XPackageJsonNotParsableError**(`packageJsonPath`, `reason`, `message`): [`XPackageJsonNotParsableError`](XPackageJsonNotParsableError.md)

Defined in: [packages/common/src/error.ts:178](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/common/src/error.ts#L178)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

##### packageJsonPath

`string`

##### reason

`unknown`

##### message

`string`

#### Returns

[`XPackageJsonNotParsableError`](XPackageJsonNotParsableError.md)

#### Overrides

[`ProjectError`](ProjectError.md).[`constructor`](ProjectError.md#constructors)

## Properties

### \[$type\]

> **\[$type\]**: `symbol`[]

Defined in: [packages/common/src/error.ts:169](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/common/src/error.ts#L169)

#### Overrides

[`ProjectError`](ProjectError.md).[`[$type]`](ProjectError.md#$type)

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

[`ProjectError`](ProjectError.md).[`cause`](ProjectError.md#cause)

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

### packageJsonPath

> `readonly` **packageJsonPath**: `string`

Defined in: [packages/common/src/error.ts:180](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/common/src/error.ts#L180)

***

### reason

> `readonly` **reason**: `unknown`

Defined in: [packages/common/src/error.ts:181](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/common/src/error.ts#L181)

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
