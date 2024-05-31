[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [resolvers](../README.md) / ConditionsOption

# Type alias: ConditionsOption

> **ConditionsOption**: `object`

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

## Source

[packages/core/src/resolvers.ts:5](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/resolvers.ts#L5)
