[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / isWorkspacePackage

# Function: isWorkspacePackage()

## Call Signature

> **isWorkspacePackage**(`o`, `options`?): `o is GenericWorkspacePackage`

Defined in: [index.ts:600](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L600)

Returns `true` if `o` is probably an instance of `WorkspacePackage` (i.e. not
a [RootPackage](../type-aliases/RootPackage.md)).

### Parameters

#### o

`unknown`

#### options?

##### generic

`true`

### Returns

`o is GenericWorkspacePackage`

## Call Signature

> **isWorkspacePackage**(`o`, `options`): `o is WorkspacePackage<XPackageJson<XPackageJsonScripts>>`

Defined in: [index.ts:604](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L604)

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

Defined in: [index.ts:608](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L608)

Returns `true` if `o` is probably an instance of `WorkspacePackage` (i.e. not
a [RootPackage](../type-aliases/RootPackage.md)).

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is WorkspacePackage\<XPackageJson\<XPackageJsonScripts\>\> \| GenericWorkspacePackage
