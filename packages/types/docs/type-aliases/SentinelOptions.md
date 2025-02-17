[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / SentinelOptions

# Type Alias: SentinelOptions

> **SentinelOptions**: `object`

Defined in: [index.ts:568](https://github.com/Xunnamius/projector/blob/ff90125e0338879bf7bf87de3d6d4aed56521e4c/packages/types/src/index.ts#L568)

The options accepted by several of the `isX` sentinel functions.

## Type declaration

### generic?

> `optional` **generic**: `boolean`

If `true`, both the generic PackageJson and non-generic
[XPackageJson](XPackageJson.md) JSON objects are accepted by this instance. If
`false`, only [XPackageJson](XPackageJson.md) is acceptable.

#### Default

```ts
true
```
