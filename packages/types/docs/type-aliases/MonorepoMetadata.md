[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / MonorepoMetadata

# Type Alias: MonorepoMetadata\<Json\>

> **MonorepoMetadata**\<`Json`\>: [`ProjectMetadata`](ProjectMetadata.md)\<`Json`\> & `object`

Defined in: [index.ts:265](https://github.com/Xunnamius/projector/blob/ff90125e0338879bf7bf87de3d6d4aed56521e4c/packages/types/src/index.ts#L265)

A collection of useful information about a monorepo.

## Type declaration

### subRootPackages

> **subRootPackages**: `NonNullable`\<[`ProjectMetadata`](ProjectMetadata.md)\[`"subRootPackages"`\]\>

### type

> **type**: [`Monorepo`](../enumerations/ProjectAttribute.md#monorepo)

## Type Parameters

• **Json** *extends* `PackageJson` \| [`XPackageJson`](XPackageJson.md) = [`XPackageJson`](XPackageJson.md)

## See

[ProjectMetadata](ProjectMetadata.md)
