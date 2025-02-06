[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / isRootPackage

# Function: isRootPackage()

## Call Signature

> **isRootPackage**(`o`, `options`?): `o is GenericRootPackage`

Defined in: [index.ts:633](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L633)

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

Defined in: [index.ts:637](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L637)

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

Defined in: [index.ts:638](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L638)

Returns `true` if `o` is probably an instance of `RootPackage` (i.e. not a
[WorkspacePackage](../type-aliases/WorkspacePackage.md)).

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is RootPackage\<XPackageJson\<XPackageJsonScripts\>\> \| GenericRootPackage
