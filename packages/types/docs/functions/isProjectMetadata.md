[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / isProjectMetadata

# Function: isProjectMetadata()

## Call Signature

> **isProjectMetadata**(`o`, `options`?): `o is GenericProjectMetadata`

Defined in: [index.ts:671](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L671)

Returns `true` if `o` is probably an instance of `ProjectMetadata`.

### Parameters

#### o

`unknown`

#### options?

##### generic?

`true`

### Returns

`o is GenericProjectMetadata`

## Call Signature

> **isProjectMetadata**(`o`, `options`): `o is ProjectMetadata<XPackageJson<XPackageJsonScripts>>`

Defined in: [index.ts:675](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L675)

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

Defined in: [index.ts:679](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L679)

Returns `true` if `o` is probably an instance of `ProjectMetadata`.

### Parameters

#### o

`unknown`

#### options

[`SentinelOptions`](../type-aliases/SentinelOptions.md)

### Returns

o is GenericProjectMetadata \| ProjectMetadata\<XPackageJson\<XPackageJsonScripts\>\>
