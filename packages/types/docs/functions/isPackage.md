[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / isPackage

# Function: isPackage()

## Call Signature

> **isPackage**(`o`, `options`?): `o is GenericPackage`

Defined in: [index.ts:583](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L583)

Returns `true` if `o` is probably an instance of `RootPackage` or
`WorkspacePackage`.

### Parameters

#### o

`unknown`

#### options?

##### generic

`true`

### Returns

`o is GenericPackage`

## Call Signature

> **isPackage**(`o`, `options`): `o is Package<XPackageJson<XPackageJsonScripts>>`

Defined in: [index.ts:584](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L584)

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

Defined in: [index.ts:585](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L585)

Returns `true` if `o` is probably an instance of `RootPackage` or
`WorkspacePackage`.

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is GenericPackage \| Package\<XPackageJson\<XPackageJsonScripts\>\>
