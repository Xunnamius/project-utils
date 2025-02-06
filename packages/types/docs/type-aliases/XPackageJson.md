[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / XPackageJson

# Type Alias: XPackageJson\<Scripts\>

> **XPackageJson**\<`Scripts`\>: `Omit`\<`OmitIndexSignature`\<`PackageJson`\>, `"bin"` \| `"name"`\> & `object`

Defined in: [index.ts:504](https://github.com/Xunnamius/projector/blob/e098c3f4be3b65babac4053c22c6872459d34fac/packages/types/src/index.ts#L504)

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
