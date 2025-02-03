[**@-xun/project-fs**](../../../../README.md)

***

[@-xun/project-fs](../../../../README.md) / [index](../../../README.md) / [JSONC](../README.md) / parse

# Function: parse()

> **parse**(`text`, `errors`?, `options`?): `any`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:87

Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
Therefore, always check the errors list to find out if the input was valid.

## Parameters

### text

`string`

### errors?

[`ParseError`](../interfaces/ParseError.md)[]

### options?

[`ParseOptions`](../interfaces/ParseOptions.md)

## Returns

`any`
