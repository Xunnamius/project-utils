[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [error](../README.md) / ProjectErrorOptions

# Type Alias: ProjectErrorOptions

> **ProjectErrorOptions** = `object`

Defined in: [packages/common/src/error.ts:6](https://github.com/Xunnamius/projector/blob/8b829a35843b6bd00f87495a6c64e0da9cfd40e7/packages/common/src/error.ts#L6)

Options available when constructing a new `ProjectError` object.

## Properties

### cause?

> `optional` **cause?**: `ErrorOptions`\[`"cause"`\]

Defined in: [packages/common/src/error.ts:16](https://github.com/Xunnamius/projector/blob/8b829a35843b6bd00f87495a6c64e0da9cfd40e7/packages/common/src/error.ts#L16)

By default, if an Error object is passed to `ProjectError`, that
`Error` instance will be passed through as `ProjectError.cause` and that
instance's `Error.message` will be passed through as
`ProjectError.message`.

Use this option to override this default behavior and instead set
`ProjectError.cause` manually.
