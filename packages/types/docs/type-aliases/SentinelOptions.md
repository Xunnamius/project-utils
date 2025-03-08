[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / SentinelOptions

# Type Alias: SentinelOptions

> **SentinelOptions**: `object`

Defined in: [index.ts:577](https://github.com/Xunnamius/projector/blob/ebfb426738fc12f1d6a23d67f21f0cfd0d162c44/packages/types/src/index.ts#L577)

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
