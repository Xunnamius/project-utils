[**@-xun/project-fs**](../../README.md)

***

[@-xun/project-fs](../../README.md) / [error](../README.md) / NotAGitRepositoryError

# Class: NotAGitRepositoryError

Defined in: [packages/common/src/error.ts:147](https://github.com/Xunnamius/projector/blob/124f6e6b6e700d669a6e7832c4ad15585be7dc80/packages/common/src/error.ts#L147)

Represents encountering a project that is not a git repository.

## Extends

- [`ProjectError`](ProjectError.md)

## Constructors

### new NotAGitRepositoryError()

> **new NotAGitRepositoryError**(): [`NotAGitRepositoryError`](NotAGitRepositoryError.md)

Defined in: [packages/common/src/error.ts:153](https://github.com/Xunnamius/projector/blob/124f6e6b6e700d669a6e7832c4ad15585be7dc80/packages/common/src/error.ts#L153)

Represents encountering a project that is not a git repository.

#### Returns

[`NotAGitRepositoryError`](NotAGitRepositoryError.md)

#### Overrides

[`ProjectError`](ProjectError.md).[`constructor`](ProjectError.md#constructors)

### new NotAGitRepositoryError()

> **new NotAGitRepositoryError**(`message`): [`NotAGitRepositoryError`](NotAGitRepositoryError.md)

Defined in: [packages/common/src/error.ts:158](https://github.com/Xunnamius/projector/blob/124f6e6b6e700d669a6e7832c4ad15585be7dc80/packages/common/src/error.ts#L158)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

##### message

`string`

#### Returns

[`NotAGitRepositoryError`](NotAGitRepositoryError.md)

#### Overrides

[`ProjectError`](ProjectError.md).[`constructor`](ProjectError.md#constructors)

## Properties

### \[$type\]

> **\[$type\]**: `symbol`[]

Defined in: [packages/common/src/error.ts:149](https://github.com/Xunnamius/projector/blob/124f6e6b6e700d669a6e7832c4ad15585be7dc80/packages/common/src/error.ts#L149)

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
