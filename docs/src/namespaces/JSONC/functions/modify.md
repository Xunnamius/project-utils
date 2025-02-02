[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [JSONC](../README.md) / modify

# Function: modify()

> **modify**(`text`, `path`, `value`, `options`): [`EditResult`](../type-aliases/EditResult.md)

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:343

Computes the edit operations needed to modify a value in the JSON document.

## Parameters

### text

`string`

### path

[`JSONPath`](../type-aliases/JSONPath.md)

The path of the value to change. The path represents either to the document root, a property or an array item.
If the path points to an non-existing property or item, it will be created.

### value

`any`

The new value for the specified property or item. If the value is undefined,
the property or item will be removed.

### options

[`ModificationOptions`](../interfaces/ModificationOptions.md)

Options

## Returns

[`EditResult`](../type-aliases/EditResult.md)

The edit operations describing the changes to the original document, following the format described in [`EditResult`](../type-aliases/EditResult.md).
To apply the edit operations to the input, use [`applyEdits`](applyEdits.md).
