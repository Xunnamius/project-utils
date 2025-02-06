[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / isRootPackage

# Function: isRootPackage()

## Call Signature

> **isRootPackage**(`o`, `options`?): `o is GenericRootPackage`

Defined in: packages/types/dist/packages/types/src/index.d.ts:570

Returns `true` if `o` is probably an instance of `RootPackage` (i.e. not a
[WorkspacePackage](../type-aliases/WorkspacePackage.md)).

### Parameters

#### o

`unknown`

#### options?

##### generic

`true`

### Returns

`o is GenericRootPackage`

## Call Signature

> **isRootPackage**(`o`, `options`): `o is RootPackage<XPackageJson<XPackageJsonScripts>>`

Defined in: packages/types/dist/packages/types/src/index.d.ts:573

Returns `true` if `o` is probably an instance of `RootPackage` (i.e. not a
[WorkspacePackage](../type-aliases/WorkspacePackage.md)).

### Parameters

#### o

`unknown`

#### options

##### generic

`false`

### Returns

`o is RootPackage<XPackageJson<XPackageJsonScripts>>`

## Call Signature

> **isRootPackage**(`o`, `options`): o is RootPackage\<XPackageJson\<XPackageJsonScripts\>\> \| GenericRootPackage

Defined in: packages/types/dist/packages/types/src/index.d.ts:576

Returns `true` if `o` is probably an instance of `RootPackage` (i.e. not a
[WorkspacePackage](../type-aliases/WorkspacePackage.md)).

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is RootPackage\<XPackageJson\<XPackageJsonScripts\>\> \| GenericRootPackage
