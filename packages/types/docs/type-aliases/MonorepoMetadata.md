[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / MonorepoMetadata

# Type Alias: MonorepoMetadata\<Json\>

> **MonorepoMetadata**\<`Json`\> = [`ProjectMetadata`](ProjectMetadata.md)\<`Json`\> & `object`

Defined in: [index.ts:274](https://github.com/Xunnamius/projector/blob/ace60864aaea74da9185b668e658744a8d21c609/packages/types/src/index.ts#L274)

A collection of useful information about a monorepo.

## Type declaration

### subRootPackages

> **subRootPackages**: `NonNullable`\<[`ProjectMetadata`](ProjectMetadata.md)\[`"subRootPackages"`\]\>

### type

> **type**: [`Monorepo`](../enumerations/ProjectAttribute.md#monorepo)

## Type Parameters

### Json

`Json` *extends* `PackageJson` \| [`XPackageJson`](XPackageJson.md) = [`XPackageJson`](XPackageJson.md)

## See

[ProjectMetadata](ProjectMetadata.md)
