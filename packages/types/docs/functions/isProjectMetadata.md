[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / isProjectMetadata

# Function: isProjectMetadata()

## Call Signature

> **isProjectMetadata**(`o`, `options`?): `o is GenericProjectMetadata`

Defined in: [index.ts:662](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L662)

Returns `true` if `o` is probably an instance of `ProjectMetadata`.

### Parameters

#### o

`unknown`

#### options?

##### generic

`true`

### Returns

`o is GenericProjectMetadata`

## Call Signature

> **isProjectMetadata**(`o`, `options`): `o is ProjectMetadata<XPackageJson<XPackageJsonScripts>>`

Defined in: [index.ts:666](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L666)

Returns `true` if `o` is probably an instance of `ProjectMetadata`.

### Parameters

#### o

`unknown`

#### options

##### generic

`false`

### Returns

`o is ProjectMetadata<XPackageJson<XPackageJsonScripts>>`

## Call Signature

> **isProjectMetadata**(`o`, `options`): o is GenericProjectMetadata \| ProjectMetadata\<XPackageJson\<XPackageJsonScripts\>\>

Defined in: [index.ts:670](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L670)

Returns `true` if `o` is probably an instance of `ProjectMetadata`.

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is GenericProjectMetadata \| ProjectMetadata\<XPackageJson\<XPackageJsonScripts\>\>
