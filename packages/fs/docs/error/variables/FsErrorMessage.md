[**@-xun/project-fs**](../../README.md)

***

[@-xun/project-fs](../../README.md) / [error](../README.md) / FsErrorMessage

# Variable: FsErrorMessage

> `const` **FsErrorMessage**: `object`

Defined in: [packages/fs/src/error.ts:9](https://github.com/Xunnamius/projector/blob/5b7550c9164a11cdadffbed45b8561eafc585ead/packages/fs/src/error.ts#L9)

A collection of possible error and warning messages.

## Type declaration

### DeriverAsyncConfigurationConflict()

> **DeriverAsyncConfigurationConflict**(): `string`

#### Returns

`string`

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

### IsNotXPackageJson()

> **IsNotXPackageJson**(): `string`

#### Returns

`string`

### NotAGitRepositoryError()

> **NotAGitRepositoryError**(): `string`

#### Returns

`string`

### NotParsable()

> **NotParsable**(`path`, `type`): `string`

#### Parameters

##### path

`string`

##### type

`string` = `'json'`

#### Returns

`string`

### NotReadable()

> **NotReadable**(`path`): `string`

#### Parameters

##### path

`string`

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
