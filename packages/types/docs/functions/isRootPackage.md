[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / isRootPackage

# Function: isRootPackage()

## Call Signature

> **isRootPackage**(`o`, `options?`): `o is GenericRootPackage`

Defined in: [index.ts:642](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L642)

Returns `true` if `o` is probably an instance of `RootPackage` (i.e. not a
[WorkspacePackage](../type-aliases/WorkspacePackage.md)).

### Parameters

#### o

`unknown`

#### options?

##### generic?

`true`

### Returns

`o is GenericRootPackage`

## Call Signature

> **isRootPackage**(`o`, `options`): `o is RootPackage<XPackageJson<XPackageJsonScripts>>`

Defined in: [index.ts:646](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L646)

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

Defined in: [index.ts:647](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L647)

Returns `true` if `o` is probably an instance of `RootPackage` (i.e. not a
[WorkspacePackage](../type-aliases/WorkspacePackage.md)).

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is RootPackage\<XPackageJson\<XPackageJsonScripts\>\> \| GenericRootPackage
