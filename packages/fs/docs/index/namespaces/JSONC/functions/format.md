[**@-xun/project-fs**](../../../../README.md)

***

[@-xun/project-fs](../../../../README.md) / [index](../../../README.md) / [JSONC](../README.md) / format

# Function: format()

> **format**(`documentText`, `range`, `options`): [`EditResult`](../type-aliases/EditResult.md)

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:312

Computes the edit operations needed to format a JSON document.

## Parameters

### documentText

`string`

The input text

### range

The range to format or `undefined` to format the full content

`undefined` | [`Range`](../interfaces/Range.md)

### options

[`FormattingOptions`](../interfaces/FormattingOptions.md)

The formatting options

## Returns

[`EditResult`](../type-aliases/EditResult.md)

The edit operations describing the formatting changes to the original document following the format described in [`EditResult`](../type-aliases/EditResult.md).
To apply the edit operations to the input, use [`applyEdits`](applyEdits.md).
