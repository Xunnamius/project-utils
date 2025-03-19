[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / SentinelOptions

# Type Alias: SentinelOptions

> **SentinelOptions** = `object`

Defined in: packages/types/dist/packages/types/src/index.d.ts:543

The options accepted by several of the `isX` sentinel functions.

## Properties

### generic?

> `optional` **generic**: `boolean`

Defined in: packages/types/dist/packages/types/src/index.d.ts:551

If `true`, both the generic PackageJson and non-generic
[XPackageJson](XPackageJson.md) JSON objects are accepted by this instance. If
`false`, only [XPackageJson](XPackageJson.md) is acceptable.

#### Default

```ts
true
```
