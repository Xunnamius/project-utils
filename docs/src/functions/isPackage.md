[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / isPackage

# Function: isPackage()

## Call Signature

> **isPackage**(`o`, `options`?): `o is GenericPackage`

Defined in: packages/types/dist/packages/types/src/index.d.ts:557

Returns `true` if `o` is probably an instance of `RootPackage` or
`WorkspacePackage`.

### Parameters

#### o

`unknown`

#### options?

##### generic?

`true`

### Returns

`o is GenericPackage`

## Call Signature

> **isPackage**(`o`, `options`): `o is Package<XPackageJson<XPackageJsonScripts>>`

Defined in: packages/types/dist/packages/types/src/index.d.ts:560

Returns `true` if `o` is probably an instance of `RootPackage` or
`WorkspacePackage`.

### Parameters

#### o

`unknown`

#### options

##### generic

`false`

### Returns

`o is Package<XPackageJson<XPackageJsonScripts>>`

## Call Signature

> **isPackage**(`o`, `options`): o is GenericPackage \| Package\<XPackageJson\<XPackageJsonScripts\>\>

Defined in: packages/types/dist/packages/types/src/index.d.ts:563

Returns `true` if `o` is probably an instance of `RootPackage` or
`WorkspacePackage`.

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is GenericPackage \| Package\<XPackageJson\<XPackageJsonScripts\>\>
