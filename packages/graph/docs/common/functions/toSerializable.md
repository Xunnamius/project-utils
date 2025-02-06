[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [common](../README.md) / toSerializable

# Function: toSerializable()

> **toSerializable**\<`T`\>(`idComponent`): [`Serializable`](../type-aliases/Serializable.md)\<`T`\>

Defined in: [packages/graph/src/common.ts:290](https://github.com/Xunnamius/projector/blob/59b666306f350998305385510a73188f6fba94a3/packages/graph/src/common.ts#L290)

Make `component` serializable by `@-xun/memoizer` (`JSON.stringify`).

## Type Parameters

• **T** *extends* `GenericProjectMetadata` \| `ProjectMetadata` \| `GenericPackage` \| `Package`

## Parameters

### idComponent

`T`

## Returns

[`Serializable`](../type-aliases/Serializable.md)\<`T`\>

## See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description
