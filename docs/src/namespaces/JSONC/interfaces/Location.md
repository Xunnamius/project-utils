[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [JSONC](../README.md) / Location

# Interface: Location

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:158

## Properties

### isAtPropertyKey

> **isAtPropertyKey**: `boolean`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:177

If set, the location's offset is at a property key.

***

### matches()

> **matches**: (`patterns`) => `boolean`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:173

Matches the locations path against a pattern consisting of strings (for properties) and numbers (for array indices).
'*' will match a single segment of any property name or index.
'**' will match a sequence of segments of any property name or index, or no segment.

#### Parameters

##### patterns

[`JSONPath`](../type-aliases/JSONPath.md)

#### Returns

`boolean`

***

### path

> **path**: [`JSONPath`](../type-aliases/JSONPath.md)

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:167

The path describing the location in the JSON document. The path consists of a sequence of strings
representing an object property or numbers for array indices.

***

### previousNode?

> `optional` **previousNode**: [`Node`](Node.md)

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:162

The previous property key or literal value (string, number, boolean or null) or undefined.
