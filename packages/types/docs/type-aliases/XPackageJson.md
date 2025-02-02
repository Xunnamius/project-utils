[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / XPackageJson

# Type Alias: XPackageJson\<Scripts\>

> **XPackageJson**\<`Scripts`\>: `Omit`\<`OmitIndexSignature`\<`PackageJson`\>, `"bin"` \| `"name"`\> & `object`

Defined in: [index.ts:502](https://github.com/Xunnamius/projector/blob/13e6ed6a56dc037b1a9ba7cd7dfcf6687e7f59ca/packages/types/src/index.ts#L502)

A version of PackageJson used by symbiote-powered projects with
certain additional properties and other properties that are guaranteed to
exist.

## Type declaration

### bin?

> `optional` **bin**: `string` \| `Record`\<`string`, `string`\>

### name

> **name**: `NonNullable`\<`PackageJson`\[`"name"`\]\>

### scripts?

> `optional` **scripts**: `Scripts`

## Type Parameters

• **Scripts** *extends* `Partial`\<`Record`\<`string`, `string`\>\> = [`XPackageJsonScripts`](XPackageJsonScripts.md)
