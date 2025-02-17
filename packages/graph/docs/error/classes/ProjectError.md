[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [error](../README.md) / ProjectError

# Class: ProjectError

Defined in: [packages/common/src/error.ts:104](https://github.com/Xunnamius/projector/blob/ea32adc50974a6b6b82e71ee97678647e4be8f84/packages/common/src/error.ts#L104)

Represents an exception originating from project meta-analysis tooling (e.g.
@-xun/project).

## Extends

- `Error`

## Extended by

- [`NotAGitRepositoryError`](NotAGitRepositoryError.md)
- [`XPackageJsonNotParsableError`](XPackageJsonNotParsableError.md)
- [`DuplicatePackageNameError`](DuplicatePackageNameError.md)
- [`DuplicatePackageIdError`](DuplicatePackageIdError.md)

## Implements

- `NonNullable`\<[`ProjectErrorOptions`](../type-aliases/ProjectErrorOptions.md)\>

## Constructors

### new ProjectError()

> **new ProjectError**(`reason`?, `options`?): [`ProjectError`](ProjectError.md)

Defined in: [packages/common/src/error.ts:111](https://github.com/Xunnamius/projector/blob/ea32adc50974a6b6b82e71ee97678647e4be8f84/packages/common/src/error.ts#L111)

Represents a project-specific error, optionally with suggested exit code
and other context.

#### Parameters

##### reason?

`string` | `Error`

##### options?

[`ProjectErrorOptions`](../type-aliases/ProjectErrorOptions.md)

#### Returns

[`ProjectError`](ProjectError.md)

#### Overrides

`Error.constructor`

### new ProjectError()

> **new ProjectError**(`reason`, `options`, `message`, `superOptions`): [`ProjectError`](ProjectError.md)

Defined in: [packages/common/src/error.ts:116](https://github.com/Xunnamius/projector/blob/ea32adc50974a6b6b82e71ee97678647e4be8f84/packages/common/src/error.ts#L116)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

##### reason

`string` | `Error`

##### options

[`ProjectErrorOptions`](../type-aliases/ProjectErrorOptions.md)

##### message

`string`

##### superOptions

`ErrorOptions`

#### Returns

[`ProjectError`](ProjectError.md)

#### Overrides

`Error.constructor`

## Properties

### \[$type\]

> **\[$type\]**: `symbol`[]

Defined in: [packages/common/src/error.ts:106](https://github.com/Xunnamius/projector/blob/ea32adc50974a6b6b82e71ee97678647e4be8f84/packages/common/src/error.ts#L106)

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Implementation of

`NonNullable.cause`

#### Inherited from

`Error.cause`

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

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

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`Error.stackTraceLimit`

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

`Error.captureStackTrace`
