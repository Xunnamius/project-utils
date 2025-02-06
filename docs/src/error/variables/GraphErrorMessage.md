[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [src/error](../README.md) / GraphErrorMessage

# Variable: GraphErrorMessage

> `const` **GraphErrorMessage**: `object`

Defined in: packages/graph/dist/packages/graph/src/error.d.ts:6

A collection of possible error and warning messages.

## Type declaration

### DeriverAsyncConfigurationConflict()

> **DeriverAsyncConfigurationConflict**: () => `string`

#### Returns

`string`

### BadProjectTypeInPackageJson()

#### Parameters

##### path

`string`

#### Returns

`string`

### CannotBeCliAndNextJs()

#### Returns

`string`

### DependencyCycle()

#### Parameters

##### involvedPackages

`string`[]

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

### IllegalAliasBadSuffix()

#### Parameters

##### key

`string`

#### Returns

`string`

### IllegalAliasKeyInvalidCharacters()

#### Parameters

##### key

`string`

##### invalids

`string` | `RegExp`

#### Returns

`string`

### IllegalAliasValueInvalidCharacters()

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

#### Parameters

##### key

`string`

##### path

`string`

#### Returns

`string`

### IllegalPrivateDependency()

#### Parameters

##### dependent

`string`

##### dependency

`string`

#### Returns

`string`

### MissingNameInPackageJson()

#### Parameters

##### path

`string`

#### Returns

`string`

### MissingOptionalBabelDependency()

#### Parameters

##### caller

`string`

#### Returns

`string`

### NotAGitRepositoryError()

#### Returns

`string`

### NotAMonorepoError()

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

### PathOutsideRoot()

#### Parameters

##### path

`string`

#### Returns

`string`

### SpecifierNotOkEmpty()

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkMissingExtension()

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkRelative()

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkSelfReferential()

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkSuboptimal()

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

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkVerseNotAllowed()

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

#### Returns

`string`

### UnsupportedFeature()

#### Parameters

##### feature

`string`

#### Returns

`string`
