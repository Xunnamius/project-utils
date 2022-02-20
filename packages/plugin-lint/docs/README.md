## Table of contents

### Type aliases

- [Arguments][1]
- [Context][2]
- [Parser][3]
- [Program][4]

### Functions

- [configureProgram][5]

## Type aliases

### Arguments

Ƭ **Arguments**<`T`>: `T` & { `[argName: string]`: `unknown`; `$0`: `string` ;
`_`: (`string` | `number`)\[] }

#### Type parameters

| Name | Type |
| :--- | :--- |
| `T`  | {}   |

#### Defined in

node_modules/@types/yargs/index.d.ts:641

---

### Context

Ƭ **Context**: `Object`

#### Type declaration

| Name      | Type           |
| :-------- | :------------- |
| `parse`   | [`Parser`][3]  |
| `program` | [`Program`][4] |

#### Defined in

[packages/plugin-lint/src/index.ts:19][6]

---

### Parser

Ƭ **Parser**: (`argv?`: `string`\[]) => `Promise`<[`Arguments`][1]>

#### Type declaration

▸ (`argv?`): `Promise`<[`Arguments`][1]>

##### Parameters

| Name    | Type        |
| :------ | :---------- |
| `argv?` | `string`\[] |

##### Returns

`Promise`<[`Arguments`][1]>

#### Defined in

[packages/plugin-lint/src/index.ts:17][7]

---

### Program

Ƭ **Program**: `Argv`

#### Defined in

[packages/plugin-lint/src/index.ts:15][8]

## Functions

### configureProgram

▸ **configureProgram**(): [`Context`][2]

Create and return a pre-configured Yargs instance (program) and argv parser.

#### Returns

[`Context`][2]

#### Defined in

[packages/plugin-lint/src/index.ts:29][9]

▸ **configureProgram**(`program`): [`Context`][2]

Configure an existing Yargs instance (program) and return an argv parser.

#### Parameters

| Name      | Type           | Description                   |
| :-------- | :------------- | :---------------------------- |
| `program` | [`Program`][4] | A Yargs instance to configure |

#### Returns

[`Context`][2]

#### Defined in

[packages/plugin-lint/src/index.ts:35][10]

[1]: README.md#arguments
[2]: README.md#context
[3]: README.md#parser
[4]: README.md#program
[5]: README.md#configureprogram
[6]:
  https://github.com/Xunnamius/projector/blob/a61864d/packages/plugin-lint/src/index.ts#L19
[7]:
  https://github.com/Xunnamius/projector/blob/a61864d/packages/plugin-lint/src/index.ts#L17
[8]:
  https://github.com/Xunnamius/projector/blob/a61864d/packages/plugin-lint/src/index.ts#L15
[9]:
  https://github.com/Xunnamius/projector/blob/a61864d/packages/plugin-lint/src/index.ts#L29
[10]:
  https://github.com/Xunnamius/projector/blob/a61864d/packages/plugin-lint/src/index.ts#L35
