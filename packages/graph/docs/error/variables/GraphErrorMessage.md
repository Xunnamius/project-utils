[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [error](../README.md) / GraphErrorMessage

# Variable: GraphErrorMessage

> `const` **GraphErrorMessage**: `object`

Defined in: [packages/graph/src/error.ts:19](https://github.com/Xunnamius/projector/blob/514ccc0cc29a5be24dff01a84b9935be834df2b5/packages/graph/src/error.ts#L19)

A collection of possible error and warning messages.

## Type Declaration

### DeriverAsyncConfigurationConflict()

> **DeriverAsyncConfigurationConflict**: () => `string` = `FsErrorMessage.DeriverAsyncConfigurationConflict`

#### Returns

`string`

### BadProjectTypeInPackageJson()

> **BadProjectTypeInPackageJson**(`path`): `string`

#### Parameters

##### path

`string`

#### Returns

`string`

### CannotBeCliAndNextJs()

> **CannotBeCliAndNextJs**(): `string`

#### Returns

`string`

### DependencyCycle()

> **DependencyCycle**(`involvedPackages`): `string`

#### Parameters

##### involvedPackages

`string`[]

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

### IllegalAliasBadSuffix()

> **IllegalAliasBadSuffix**(`key`): `string`

#### Parameters

##### key

`string`

#### Returns

`string`

### IllegalAliasKeyInvalidCharacters()

> **IllegalAliasKeyInvalidCharacters**(`key`, `invalids`): `string`

#### Parameters

##### key

`string`

##### invalids

`string` | `RegExp`

#### Returns

`string`

### IllegalAliasValueInvalidCharacters()

> **IllegalAliasValueInvalidCharacters**(`key`, `path`, `invalids`): `string`

#### Parameters

##### key

`string`

##### path

`string`

##### invalids

`string` | `RegExp`

#### Returns

`string`

### IllegalAliasValueInvalidSeparatorAdfix()

> **IllegalAliasValueInvalidSeparatorAdfix**(`key`, `path`): `string`

#### Parameters

##### key

`string`

##### path

`string`

#### Returns

`string`

### IllegalPrivateDependency()

> **IllegalPrivateDependency**(`dependent`, `dependency`): `string`

#### Parameters

##### dependent

`string`

##### dependency

`string`

#### Returns

`string`

### MissingNameInPackageJson()

> **MissingNameInPackageJson**(`path`): `string`

#### Parameters

##### path

`string`

#### Returns

`string`

### MissingOptionalBabelDependency()

> **MissingOptionalBabelDependency**(`caller`): `string`

#### Parameters

##### caller

`string`

#### Returns

`string`

### NotAGitRepositoryError()

> **NotAGitRepositoryError**(): `string`

#### Returns

`string`

### NotAMonorepoError()

> **NotAMonorepoError**(): `string`

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

### PathOutsideRoot()

> **PathOutsideRoot**(`path`): `string`

#### Parameters

##### path

`string`

#### Returns

`string`

### SpecifierNotOkEmpty()

> **SpecifierNotOkEmpty**(`specifier`, `path?`): `string`

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkMissingExtension()

> **SpecifierNotOkMissingExtension**(`specifier`, `path?`): `string`

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkRelative()

> **SpecifierNotOkRelative**(`specifier`, `path?`): `string`

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkSelfReferential()

> **SpecifierNotOkSelfReferential**(`specifier`, `path?`): `string`

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkSuboptimal()

> **SpecifierNotOkSuboptimal**(`specifier`, `replacement`, `path?`): `string`

#### Parameters

##### specifier

`string`

##### replacement

`undefined` | `string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkUnnecessaryIndex()

> **SpecifierNotOkUnnecessaryIndex**(`specifier`, `path?`): `string`

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkVerseNotAllowed()

> **SpecifierNotOkVerseNotAllowed**(`verse`, `specifier`, `path?`): `string`

#### Parameters

##### verse

`string`

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### TargetUnserializable()

> **TargetUnserializable**(): `string`

#### Returns

`string`

### UnsupportedFeature()

> **UnsupportedFeature**(`feature`): `string`

#### Parameters

##### feature

`string`

#### Returns

`string`
