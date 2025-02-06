[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / MonorepoMetadata

# Type Alias: MonorepoMetadata\<Json\>

> **MonorepoMetadata**\<`Json`\>: [`ProjectMetadata`](ProjectMetadata.md)\<`Json`\> & `object`

Defined in: [index.ts:265](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L265)

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
