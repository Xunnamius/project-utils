[**@-xun/project-fs**](../../../../README.md)

***

[@-xun/project-fs](../../../../README.md) / [index](../../../README.md) / [JSONC](../README.md) / applyEdits

# Function: applyEdits()

> **applyEdits**(`text`, `edits`): `string`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:351

Applies edits to an input string.

## Parameters

### text

`string`

The input text

### edits

[`EditResult`](../type-aliases/EditResult.md)

Edit operations following the format described in [`EditResult`](../type-aliases/EditResult.md).

## Returns

`string`

The text with the applied edits.

## Throws

An error if the edit operations are not well-formed as described in [`EditResult`](../type-aliases/EditResult.md).
