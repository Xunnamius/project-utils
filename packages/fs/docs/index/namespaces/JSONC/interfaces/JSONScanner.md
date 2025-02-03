[**@-xun/project-fs**](../../../../README.md)

***

[@-xun/project-fs](../../../../README.md) / [index](../../../README.md) / [JSONC](../README.md) / JSONScanner

# Interface: JSONScanner

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:37

The scanner object, representing a JSON scanner at a position in the input string.

## Methods

### getPosition()

> **getPosition**(): `number`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:49

Returns the zero-based current scan position, which is after the last read token.

#### Returns

`number`

***

### getToken()

> **getToken**(): [`SyntaxKind`](../enumerations/SyntaxKind.md)

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:53

Returns the last read token.

#### Returns

[`SyntaxKind`](../enumerations/SyntaxKind.md)

***

### getTokenError()

> **getTokenError**(): [`ScanError`](../enumerations/ScanError.md)

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:77

An error code of the last scan.

#### Returns

[`ScanError`](../enumerations/ScanError.md)

***

### getTokenLength()

> **getTokenLength**(): `number`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:65

The length of the last read token.

#### Returns

`number`

***

### getTokenOffset()

> **getTokenOffset**(): `number`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:61

The zero-based start offset of the last read token.

#### Returns

`number`

***

### getTokenStartCharacter()

> **getTokenStartCharacter**(): `number`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:73

The zero-based start character (column) of the last read token.

#### Returns

`number`

***

### getTokenStartLine()

> **getTokenStartLine**(): `number`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:69

The zero-based start line number of the last read token.

#### Returns

`number`

***

### getTokenValue()

> **getTokenValue**(): `string`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:57

Returns the last read token value. The value for strings is the decoded string content. For numbers it's of type number, for boolean it's true or false.

#### Returns

`string`

***

### scan()

> **scan**(): [`SyntaxKind`](../enumerations/SyntaxKind.md)

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:45

Read the next token. Returns the token code.

#### Returns

[`SyntaxKind`](../enumerations/SyntaxKind.md)

***

### setPosition()

> **setPosition**(`pos`): `void`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:41

Sets the scan position to a new offset. A call to 'scan' is needed to get the first token.

#### Parameters

##### pos

`number`

#### Returns

`void`
