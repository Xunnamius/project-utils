[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / MonorepoMetadata

# Type Alias: MonorepoMetadata\<Json\>

> **MonorepoMetadata**\<`Json`\>: [`ProjectMetadata`](ProjectMetadata.md)\<`Json`\> & `object`

Defined in: [index.ts:274](https://github.com/Xunnamius/projector/blob/ebfb426738fc12f1d6a23d67f21f0cfd0d162c44/packages/types/src/index.ts#L274)

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
