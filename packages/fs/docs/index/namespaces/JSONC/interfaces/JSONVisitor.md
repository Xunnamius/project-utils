[**@-xun/project-fs**](../../../../README.md)

***

[@-xun/project-fs](../../../../README.md) / [index](../../../README.md) / [JSONC](../README.md) / JSONVisitor

# Interface: JSONVisitor

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:195

Visitor called by [`visit`](../variables/visit.md) when parsing JSON.

The visitor functions have the following common parameters:
- `offset`: Global offset within the JSON document, starting at 0
- `startLine`: Line number, starting at 0
- `startCharacter`: Start character (column) within the current line, starting at 0

Additionally some functions have a `pathSupplier` parameter which can be used to obtain the
current `JSONPath` within the document.

## Properties

### onArrayBegin()?

> `optional` **onArrayBegin**: (`offset`, `length`, `startLine`, `startCharacter`, `pathSupplier`) => `boolean` \| `void`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:215

Invoked when an open bracket is encountered. The offset and length represent the location of the open bracket.
When `false` is returned, the array items will not be visited.

#### Parameters

##### offset

`number`

##### length

`number`

##### startLine

`number`

##### startCharacter

`number`

##### pathSupplier

() => [`JSONPath`](../type-aliases/JSONPath.md)

#### Returns

`boolean` \| `void`

***

### onArrayEnd()?

> `optional` **onArrayEnd**: (`offset`, `length`, `startLine`, `startCharacter`) => `void`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:219

Invoked when a closing bracket is encountered. The offset and length represent the location of the closing bracket.

#### Parameters

##### offset

`number`

##### length

`number`

##### startLine

`number`

##### startCharacter

`number`

#### Returns

`void`

***

### onComment()?

> `optional` **onComment**: (`offset`, `length`, `startLine`, `startCharacter`) => `void`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:231

When comments are allowed, invoked when a line or block comment is encountered. The offset and length represent the location of the comment.

#### Parameters

##### offset

`number`

##### length

`number`

##### startLine

`number`

##### startCharacter

`number`

#### Returns

`void`

***

### onError()?

> `optional` **onError**: (`error`, `offset`, `length`, `startLine`, `startCharacter`) => `void`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:235

Invoked on an error.

#### Parameters

##### error

[`ParseErrorCode`](../enumerations/ParseErrorCode.md)

##### offset

`number`

##### length

`number`

##### startLine

`number`

##### startCharacter

`number`

#### Returns

`void`

***

### onLiteralValue()?

> `optional` **onLiteralValue**: (`value`, `offset`, `length`, `startLine`, `startCharacter`, `pathSupplier`) => `void`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:223

Invoked when a literal value is encountered. The offset and length represent the location of the literal value.

#### Parameters

##### value

`any`

##### offset

`number`

##### length

`number`

##### startLine

`number`

##### startCharacter

`number`

##### pathSupplier

() => [`JSONPath`](../type-aliases/JSONPath.md)

#### Returns

`void`

***

### onObjectBegin()?

> `optional` **onObjectBegin**: (`offset`, `length`, `startLine`, `startCharacter`, `pathSupplier`) => `boolean` \| `void`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:200

Invoked when an open brace is encountered and an object is started. The offset and length represent the location of the open brace.
When `false` is returned, the object properties will not be visited.

#### Parameters

##### offset

`number`

##### length

`number`

##### startLine

`number`

##### startCharacter

`number`

##### pathSupplier

() => [`JSONPath`](../type-aliases/JSONPath.md)

#### Returns

`boolean` \| `void`

***

### onObjectEnd()?

> `optional` **onObjectEnd**: (`offset`, `length`, `startLine`, `startCharacter`) => `void`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:210

Invoked when a closing brace is encountered and an object is completed. The offset and length represent the location of the closing brace.

#### Parameters

##### offset

`number`

##### length

`number`

##### startLine

`number`

##### startCharacter

`number`

#### Returns

`void`

***

### onObjectProperty()?

> `optional` **onObjectProperty**: (`property`, `offset`, `length`, `startLine`, `startCharacter`, `pathSupplier`) => `void`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:206

Invoked when a property is encountered. The offset and length represent the location of the property name.
The `JSONPath` created by the `pathSupplier` refers to the enclosing JSON object, it does not include the
property name yet.

#### Parameters

##### property

`string`

##### offset

`number`

##### length

`number`

##### startLine

`number`

##### startCharacter

`number`

##### pathSupplier

() => [`JSONPath`](../type-aliases/JSONPath.md)

#### Returns

`void`

***

### onSeparator()?

> `optional` **onSeparator**: (`character`, `offset`, `length`, `startLine`, `startCharacter`) => `void`

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:227

Invoked when a comma or colon separator is encountered. The offset and length represent the location of the separator.

#### Parameters

##### character

`string`

##### offset

`number`

##### length

`number`

##### startLine

`number`

##### startCharacter

`number`

#### Returns

`void`
