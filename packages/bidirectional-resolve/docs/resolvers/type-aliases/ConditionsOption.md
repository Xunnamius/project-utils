[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [resolvers](../README.md) / ConditionsOption

# Type Alias: ConditionsOption

> **ConditionsOption**: `object`

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:12](https://github.com/Xunnamius/projector/blob/abb7a8a9dd6d67e38b8f61a8a35a6da8e7f6b5f3/packages/bidirectional-resolve/src/resolvers.ts#L12)

## Type declaration

### conditions?

> `optional` **conditions**: `string`[]

Conditions to recursively match against. If none of the listed conditions
can be found and there are no matching `default` conditions, this function
returns an empty array.

In addition to `default` (which is always implicitly enabled), the
following are standard/well-known conditions:
  - `import`
  - `require`
  - `node`
  - `node-addons`
  - `types`
  - `deno`
  - `browser`
  - `react-native`
  - `electron`
  - `development`
  - `production`

Array order does not matter. Priority is determined by the property order
of conditions defined within a `package.json` `imports`/`exports` mapping.

#### See

https://nodejs.org/api/packages.html#community-conditions-definitions
