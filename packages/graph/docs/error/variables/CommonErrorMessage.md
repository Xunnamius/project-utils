[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [error](../README.md) / CommonErrorMessage

# Variable: CommonErrorMessage

> `const` **CommonErrorMessage**: `object`

Defined in: [packages/common/src/error.ts:259](https://github.com/Xunnamius/projector/blob/7b62fe0623286ad7bf6227972127d835f758db94/packages/common/src/error.ts#L259)

A collection of possible error and warning messages.

## Type declaration

### DuplicatePackageId()

> **DuplicatePackageId**(`id`, `firstPath`, `secondPath`): `string`

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

> **DuplicatePackageName**(`packageName`, `firstPath`, `secondPath`): `string`

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

> **Generic**(): `string`

#### Returns

`string`

### GuruMeditation()

> **GuruMeditation**(): `string`

#### Returns

`string`

### NotAGitRepositoryError()

> **NotAGitRepositoryError**(): `string`

#### Returns

`string`

### PackageJsonNotParsable()

> **PackageJsonNotParsable**(`packageJsonPath`, `reason`): `string`

#### Parameters

##### packageJsonPath

`string`

##### reason

`unknown`

#### Returns

`string`
