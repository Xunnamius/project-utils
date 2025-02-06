[**@-xun/project-fs**](../../README.md)

***

[@-xun/project-fs](../../README.md) / [error](../README.md) / FsErrorMessage

# Variable: FsErrorMessage

> `const` **FsErrorMessage**: `object`

Defined in: [packages/fs/src/error.ts:9](https://github.com/Xunnamius/projector/blob/d4cf8eeb9fc68bed9fcdc6582a854ec38ada9801/packages/fs/src/error.ts#L9)

A collection of possible error and warning messages.

## Type declaration

### DeriverAsyncConfigurationConflict()

#### Returns

`string`

### DuplicatePackageId()

#### Parameters

##### id

`string`

##### firstPath

`string`

##### secondPath

`string`

#### Returns

`string`

### DuplicatePackageName()

#### Parameters

##### packageName

`string`

##### firstPath

`string`

##### secondPath

`string`

#### Returns

`string`

### Generic()

#### Returns

`string`

### GuruMeditation()

#### Returns

`string`

### NotAGitRepositoryError()

#### Returns

`string`

### NotParsable()

#### Parameters

##### path

`string`

##### type

`string` = `'json'`

#### Returns

`string`

### NotReadable()

#### Parameters

##### path

`string`

#### Returns

`string`

### PackageJsonNotParsable()

#### Parameters

##### packageJsonPath

`string`

##### reason

`unknown`

#### Returns

`string`
