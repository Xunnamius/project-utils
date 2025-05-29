[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / SentinelOptions

# Type Alias: SentinelOptions

> **SentinelOptions** = `object`

Defined in: [index.ts:577](https://github.com/Xunnamius/projector/blob/ace60864aaea74da9185b668e658744a8d21c609/packages/types/src/index.ts#L577)

The options accepted by several of the `isX` sentinel functions.

## Properties

### generic?

> `optional` **generic**: `boolean`

Defined in: [index.ts:585](https://github.com/Xunnamius/projector/blob/ace60864aaea74da9185b668e658744a8d21c609/packages/types/src/index.ts#L585)

If `true`, both the generic PackageJson and non-generic
[XPackageJson](XPackageJson.md) JSON objects are accepted by this instance. If
`false`, only [XPackageJson](XPackageJson.md) is acceptable.

#### Default

```ts
true
```
