[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [src/error](../README.md) / ProjectErrorOptions

# Type Alias: ProjectErrorOptions

> **ProjectErrorOptions**: `object`

Defined in: [packages/common/src/error.ts:23](https://github.com/Xunnamius/projector/blob/f08ba65b842709375f6fb4363372a734742d54c1/packages/common/src/error.ts#L23)

Options available when constructing a new `ProjectError` object.

## Type declaration

### cause?

> `optional` **cause**: `ErrorOptions`\[`"cause"`\]

By default, if an Error object is passed to `CliError`, that
`Error` instance will be passed through as `CliError.cause` and that
instance's `Error.message` will be passed through as `CliError.message`.

Use this option to override this default behavior and instead set
`CliError.cause` manually.
