[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [error](../README.md) / CommonErrorMessage

# Variable: CommonErrorMessage

> `const` **CommonErrorMessage**: `object`

Defined in: [packages/common/src/error.ts:259](https://github.com/Xunnamius/projector/blob/b164ec02958be4a3fc50929ad4f824678a7453d6/packages/common/src/error.ts#L259)

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
