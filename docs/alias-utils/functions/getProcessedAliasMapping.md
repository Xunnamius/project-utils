[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [alias-utils](../README.md) / getProcessedAliasMapping

# Function: getProcessedAliasMapping()

> **getProcessedAliasMapping**(`__namedParameters`): readonly [`object`, `object`]

Takes an alias mapping, validates it, and returns its constituent parts.

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.issueTypescriptWarning?**: `boolean`= `false`

If true, attempting to resolve an alias at runtime, which TypeScript does
not support, will trigger a TypeScript-specific warning.

**Default**

```ts
false
```

• **\_\_namedParameters.mapping**: [`string`, `string`]

A single mapping between an alias `key` and its real path `value`.

## Returns

readonly [`object`, `object`]

## Source

[packages/core/src/alias-utils.ts:54](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/alias-utils.ts#L54)
