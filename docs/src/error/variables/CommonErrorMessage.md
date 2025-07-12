[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [src/error](../README.md) / CommonErrorMessage

# Variable: CommonErrorMessage

> `const` **CommonErrorMessage**: `object`

Defined in: [packages/common/src/error.ts:197](https://github.com/Xunnamius/projector/blob/be1a6e83d98b597cc88a529293d6f2c53c8959cb/packages/common/src/error.ts#L197)

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
