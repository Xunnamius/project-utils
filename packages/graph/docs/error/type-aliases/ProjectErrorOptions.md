[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [error](../README.md) / ProjectErrorOptions

# Type Alias: ProjectErrorOptions

> **ProjectErrorOptions** = `object`

Defined in: [packages/common/src/error.ts:24](https://github.com/Xunnamius/projector/blob/7b62fe0623286ad7bf6227972127d835f758db94/packages/common/src/error.ts#L24)

Options available when constructing a new `ProjectError` object.

## Properties

### cause?

> `optional` **cause**: `ErrorOptions`\[`"cause"`\]

Defined in: [packages/common/src/error.ts:34](https://github.com/Xunnamius/projector/blob/7b62fe0623286ad7bf6227972127d835f758db94/packages/common/src/error.ts#L34)

By default, if an Error object is passed to `ProjectError`, that
`Error` instance will be passed through as `ProjectError.cause` and that
instance's `Error.message` will be passed through as
`ProjectError.message`.

Use this option to override this default behavior and instead set
`ProjectError.cause` manually.
