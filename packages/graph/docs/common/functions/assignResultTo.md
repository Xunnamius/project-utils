[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [common](../README.md) / assignResultTo

# Function: assignResultTo()

> **assignResultTo**(`parentObject`, `key`): (`result`) => `void`

Defined in: [packages/graph/src/common.ts:277](https://github.com/Xunnamius/projector/blob/e784a5e8ae5bff24c71e3b35914b446e5dd59fe7/packages/graph/src/common.ts#L277)

Used to assign the result of an asynchronous operation to some key in some
object. For example:

```typescript
await Promise.all(items.map(async (item) => { ... }))
  .then((mappedItems) => new Map(mappedItems))
  .then(assignResultTo(accumulatorObject, 'someKey'));

await someAsyncFn(something).then(
  assignResultTo(accumulatorObject, 'someOtherKey')
);
```

## Parameters

### parentObject

`Record`\<`string`, `unknown`\>

### key

`string`

## Returns

> (`result`): `void`

### Parameters

#### result

`unknown`

### Returns

`void`
