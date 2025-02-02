[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [JSONC](../README.md) / Edit

# Interface: Edit

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:251

Represents a text modification

## Properties

### content

> **content**: `string`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:263

The new content. Empty content represents a *remove*.

***

### length

> **length**: `number`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:259

The length of the modification. Must not be negative. Empty length represents an *insert*.

***

### offset

> **offset**: `number`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:255

The start offset of the modification.
