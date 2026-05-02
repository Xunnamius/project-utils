[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [JSONC](../README.md) / parseTree

# Variable: parseTree

> `const` **parseTree**: (`text`, `errors?`, `options?`) => [`Node`](../interfaces/Node.md) \| `undefined`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:91

Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.

## Parameters

### text

`string`

### errors?

[`ParseError`](../interfaces/ParseError.md)[]

### options?

[`ParseOptions`](../interfaces/ParseOptions.md)

## Returns

[`Node`](../interfaces/Node.md) \| `undefined`
