[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [src/error](../README.md) / CommonErrorMessage

# Variable: CommonErrorMessage

> `const` **CommonErrorMessage**: `object`

Defined in: [packages/common/src/error.ts:257](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/common/src/error.ts#L257)

A collection of possible error and warning messages.

## Type declaration

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

### PackageJsonNotParsable()

#### Parameters

##### packageJsonPath

`string`

##### reason

`unknown`

#### Returns

`string`
