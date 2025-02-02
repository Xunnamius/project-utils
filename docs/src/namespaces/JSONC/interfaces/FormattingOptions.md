[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [JSONC](../README.md) / FormattingOptions

# Interface: FormattingOptions

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:281

Options used by [`format`](../functions/format.md) when computing the formatting edit operations

## Properties

### eol?

> `optional` **eol**: `string`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:293

The default 'end of line' character. If not set, '\n' is used as default.

***

### insertFinalNewline?

> `optional` **insertFinalNewline**: `boolean`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:297

If set, will add a new line at the end of the document.

***

### insertSpaces?

> `optional` **insertSpaces**: `boolean`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:289

Is indentation based on spaces?

***

### keepLines?

> `optional` **keepLines**: `boolean`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:301

If true, will keep line positions as is in the formatting

***

### tabSize?

> `optional` **tabSize**: `number`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:285

If indentation is based on spaces (`insertSpaces` = true), the number of spaces that make an indent.
