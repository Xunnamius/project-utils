[**@-xun/project-fs**](../../README.md)

***

[@-xun/project-fs](../../README.md) / [error](../README.md) / ProjectErrorOptions

# Type Alias: ProjectErrorOptions

> **ProjectErrorOptions** = `object`

Defined in: [packages/common/src/error.ts:8](https://github.com/Xunnamius/projector/blob/993e593b03d5f049b7b380ada7990aa937046ca5/packages/common/src/error.ts#L8)

Options available when constructing a new `ProjectError` object.

## Properties

### cause?

> `optional` **cause**: `ErrorOptions`\[`"cause"`\]

Defined in: [packages/common/src/error.ts:18](https://github.com/Xunnamius/projector/blob/993e593b03d5f049b7b380ada7990aa937046ca5/packages/common/src/error.ts#L18)

By default, if an Error object is passed to `ProjectError`, that
`Error` instance will be passed through as `ProjectError.cause` and that
instance's `Error.message` will be passed through as
`ProjectError.message`.

Use this option to override this default behavior and instead set
`ProjectError.cause` manually.
