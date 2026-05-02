[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / isPackage

# Function: isPackage()

## Call Signature

> **isPackage**(`o`, `options?`): `o is GenericPackage`

Defined in: [index.ts:592](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L592)

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

Defined in: [index.ts:593](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L593)

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

Defined in: [index.ts:594](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L594)

Returns `true` if `o` is probably an instance of `RootPackage` or
`WorkspacePackage`.

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is GenericPackage \| Package\<XPackageJson\<XPackageJsonScripts\>\>
