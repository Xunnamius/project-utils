[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [JSONC](../README.md) / findNodeAtOffset

# Variable: findNodeAtOffset()

> `const` **findNodeAtOffset**: (`root`, `offset`, `includeRightBound`?) => [`Node`](../interfaces/Node.md) \| `undefined`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:99

Finds the innermost node at the given offset. If includeRightBound is set, also finds nodes that end at the given offset.

## Parameters

### root

[`Node`](../interfaces/Node.md)

### offset

`number`

### includeRightBound?

`boolean`

## Returns

[`Node`](../interfaces/Node.md) \| `undefined`
