[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [common](../README.md) / assignResultTo

# Function: assignResultTo()

> **assignResultTo**(`parentObject`, `key`): (`result`) => `void`

Defined in: [packages/graph/src/common.ts:277](https://github.com/Xunnamius/projector/blob/929f57e95906b9d431b526feb4b0c2cf7ee47730/packages/graph/src/common.ts#L277)

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
