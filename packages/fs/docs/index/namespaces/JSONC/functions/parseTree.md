[**@-xun/project-fs**](../../../../README.md)

***

[@-xun/project-fs](../../../../README.md) / [index](../../../README.md) / [JSONC](../README.md) / parseTree

# Function: parseTree()

> **parseTree**(`text`, `errors`?, `options`?): `undefined` \| [`Node`](../interfaces/Node.md)

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

`undefined` \| [`Node`](../interfaces/Node.md)
