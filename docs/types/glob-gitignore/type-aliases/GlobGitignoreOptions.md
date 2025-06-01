[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [types/glob-gitignore](../README.md) / GlobGitignoreOptions

# Type Alias: GlobGitignoreOptions

> **GlobGitignoreOptions** = `Omit`\<`GlobOptions`, `"ignore"`\> & `object`

Defined in: [types/glob-gitignore.d.ts:4](https://github.com/Xunnamius/projector/blob/07d2d22c61663a5979a46f5e3de28e3c6f31eed4/types/glob-gitignore.d.ts#L4)

## Type declaration

### ignore?

> `optional` **ignore**: `string` \| `string`[]

A string or array of strings used to determine which globbed paths are
ignored. Typically this is the result of parsing a .gitignore file (or file
with compatible format) split by `"\n"`.
