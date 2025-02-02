[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / assignResultTo

# Function: assignResultTo()

> **assignResultTo**(`parentObject`, `key`): (`result`) => `void`

Defined in: packages/graph/dist/packages/graph/src/common.d.ts:257

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

`Function`

### Parameters

#### result

`unknown`

### Returns

`void`
