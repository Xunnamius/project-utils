[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [resolvers](../README.md) / ConditionsOption

# Type Alias: ConditionsOption

> **ConditionsOption** = `object`

Defined in: [resolvers.ts:12](https://github.com/Xunnamius/projector/blob/2f27fcc45a3b7194f8512eb7f0274bde1ac7ea9d/packages/bidirectional-resolve/src/resolvers.ts#L12)

## Properties

### conditions?

> `optional` **conditions?**: `string`[]

Defined in: [resolvers.ts:37](https://github.com/Xunnamius/projector/blob/2f27fcc45a3b7194f8512eb7f0274bde1ac7ea9d/packages/bidirectional-resolve/src/resolvers.ts#L37)

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
