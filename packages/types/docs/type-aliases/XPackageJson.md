[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / XPackageJson

# Type Alias: XPackageJson\<Scripts\>

> **XPackageJson**\<`Scripts`\> = `Omit`\<`OmitIndexSignature`\<`PackageJson`\>, `"bin"` \| `"name"`\> & `object`

Defined in: [index.ts:513](https://github.com/Xunnamius/projector/blob/ace60864aaea74da9185b668e658744a8d21c609/packages/types/src/index.ts#L513)

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

### Scripts

`Scripts` *extends* `Partial`\<`Record`\<`string`, `string`\>\> = [`XPackageJsonScripts`](XPackageJsonScripts.md)
