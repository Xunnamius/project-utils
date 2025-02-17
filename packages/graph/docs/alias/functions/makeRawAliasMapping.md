[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / makeRawAliasMapping

# Function: makeRawAliasMapping()

> **makeRawAliasMapping**(`rawAlias`, `rawPath`): [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)

Defined in: [packages/graph/src/alias.ts:213](https://github.com/Xunnamius/projector/blob/ea32adc50974a6b6b82e71ee97678647e4be8f84/packages/graph/src/alias.ts#L213)

Accepts partial [RawAlias](../type-aliases/RawAlias.md) and [RawPath](../type-aliases/RawPath.md) objects and returns
proper [RawAlias](../type-aliases/RawAlias.md) and [RawPath](../type-aliases/RawPath.md) objects as a key-value tuple.

Note that `rawAlias` defaults to `{ prefix: 'exact', suffix: 'open',
extensionless: true }` while `rawPath` defaults to `{ prefix: 'root', suffix:
'open' }`.

## Parameters

### rawAlias

`Partial`\<`Omit`\<[`RawAlias`](../type-aliases/RawAlias.md), `"alias"` \| `"group"` \| `"regExp"` \| `"packageId"`\>\> & `Pick`\<[`RawAlias`](../type-aliases/RawAlias.md), `"alias"` \| `"group"` \| `"packageId"`\>

### rawPath

`Partial`\<`Omit`\<[`RawPath`](../type-aliases/RawPath.md), `"path"`\>\> & `Pick`\<[`RawPath`](../type-aliases/RawPath.md), `"path"`\>

## Returns

[`RawAliasMapping`](../type-aliases/RawAliasMapping.md)
