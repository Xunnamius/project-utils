[**@-xun/project-fs**](../../README.md)

***

[@-xun/project-fs](../../README.md) / [error](../README.md) / ProjectErrorOptions

# Type Alias: ProjectErrorOptions

> **ProjectErrorOptions** = `object`

Defined in: [packages/common/src/error.ts:6](https://github.com/Xunnamius/projector/blob/7a4ee28c8d16b3a6c8cf249bb2ac2cbc32692481/packages/common/src/error.ts#L6)

Options available when constructing a new `ProjectError` object.

## Properties

### cause?

> `optional` **cause?**: `ErrorOptions`\[`"cause"`\]

Defined in: [packages/common/src/error.ts:16](https://github.com/Xunnamius/projector/blob/7a4ee28c8d16b3a6c8cf249bb2ac2cbc32692481/packages/common/src/error.ts#L16)

By default, if an Error object is passed to `ProjectError`, that
`Error` instance will be passed through as `ProjectError.cause` and that
instance's `Error.message` will be passed through as
`ProjectError.message`.

Use this option to override this default behavior and instead set
`ProjectError.cause` manually.
