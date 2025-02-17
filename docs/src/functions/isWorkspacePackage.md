[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / isWorkspacePackage

# Function: isWorkspacePackage()

## Call Signature

> **isWorkspacePackage**(`o`, `options`?): `o is GenericWorkspacePackage`

Defined in: packages/types/dist/packages/types/src/index.d.ts:559

Returns `true` if `o` is probably an instance of `WorkspacePackage` (i.e. not
a [RootPackage](../type-aliases/RootPackage.md)).

### Parameters

#### o

`unknown`

#### options?

##### generic?

`true`

### Returns

`o is GenericWorkspacePackage`

## Call Signature

> **isWorkspacePackage**(`o`, `options`): `o is WorkspacePackage<XPackageJson<XPackageJsonScripts>>`

Defined in: packages/types/dist/packages/types/src/index.d.ts:562

Returns `true` if `o` is probably an instance of `WorkspacePackage` (i.e. not
a [RootPackage](../type-aliases/RootPackage.md)).

### Parameters

#### o

`unknown`

#### options

##### generic

`false`

### Returns

`o is WorkspacePackage<XPackageJson<XPackageJsonScripts>>`

## Call Signature

> **isWorkspacePackage**(`o`, `options`): o is WorkspacePackage\<XPackageJson\<XPackageJsonScripts\>\> \| GenericWorkspacePackage

Defined in: packages/types/dist/packages/types/src/index.d.ts:565

Returns `true` if `o` is probably an instance of `WorkspacePackage` (i.e. not
a [RootPackage](../type-aliases/RootPackage.md)).

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is WorkspacePackage\<XPackageJson\<XPackageJsonScripts\>\> \| GenericWorkspacePackage
