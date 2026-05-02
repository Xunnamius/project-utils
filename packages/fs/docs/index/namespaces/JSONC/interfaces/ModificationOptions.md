[**@-xun/project-fs**](../../../../README.md)

***

[@-xun/project-fs](../../../../README.md) / [index](../../../README.md) / [JSONC](../README.md) / ModificationOptions

# Interface: ModificationOptions

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:316

Options used by [`modify`](../functions/modify.md) when computing the modification edit operations

## Properties

### formattingOptions?

> `optional` **formattingOptions?**: [`FormattingOptions`](FormattingOptions.md)

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:320

Formatting options. If undefined, the newly inserted code will be inserted unformatted.

***

### getInsertionIndex?

> `optional` **getInsertionIndex?**: (`properties`) => `number`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:329

Optional function to define the insertion index given an existing list of properties.

#### Parameters

##### properties

`string`[]

#### Returns

`number`

***

### isArrayInsertion?

> `optional` **isArrayInsertion?**: `boolean`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:325

Default false. If `JSONPath` refers to an index of an array and `isArrayInsertion` is `true`, then
[`modify`](../functions/modify.md) will insert a new item at that location instead of overwriting its contents.
