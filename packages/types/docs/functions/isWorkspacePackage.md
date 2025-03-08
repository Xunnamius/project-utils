[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / isWorkspacePackage

# Function: isWorkspacePackage()

## Call Signature

> **isWorkspacePackage**(`o`, `options`?): `o is GenericWorkspacePackage`

Defined in: [index.ts:609](https://github.com/Xunnamius/projector/blob/ebfb426738fc12f1d6a23d67f21f0cfd0d162c44/packages/types/src/index.ts#L609)

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

Defined in: [index.ts:613](https://github.com/Xunnamius/projector/blob/ebfb426738fc12f1d6a23d67f21f0cfd0d162c44/packages/types/src/index.ts#L613)

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

Defined in: [index.ts:617](https://github.com/Xunnamius/projector/blob/ebfb426738fc12f1d6a23d67f21f0cfd0d162c44/packages/types/src/index.ts#L617)

Returns `true` if `o` is probably an instance of `WorkspacePackage` (i.e. not
a [RootPackage](../type-aliases/RootPackage.md)).

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is WorkspacePackage\<XPackageJson\<XPackageJsonScripts\>\> \| GenericWorkspacePackage
