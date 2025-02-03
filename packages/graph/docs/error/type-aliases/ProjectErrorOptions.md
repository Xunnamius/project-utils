[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [error](../README.md) / ProjectErrorOptions

# Type Alias: ProjectErrorOptions

> **ProjectErrorOptions**: `object`

Defined in: [packages/common/src/error.ts:23](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/common/src/error.ts#L23)

Options available when constructing a new `ProjectError` object.

## Type declaration

### cause?

> `optional` **cause**: `ErrorOptions`\[`"cause"`\]

By default, if an Error object is passed to `CliError`, that
`Error` instance will be passed through as `CliError.cause` and that
instance's `Error.message` will be passed through as `CliError.message`.

Use this option to override this default behavior and instead set
`CliError.cause` manually.
