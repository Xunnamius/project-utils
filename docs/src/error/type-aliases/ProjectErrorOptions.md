[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [src/error](../README.md) / ProjectErrorOptions

# Type Alias: ProjectErrorOptions

> **ProjectErrorOptions**: `object`

Defined in: [packages/common/src/error.ts:24](https://github.com/Xunnamius/projector/blob/b4407b9dec88e62f1f2f2b3dd1bd93f181cb7d24/packages/common/src/error.ts#L24)

Options available when constructing a new `ProjectError` object.

## Type declaration

### cause?

> `optional` **cause**: `ErrorOptions`\[`"cause"`\]

By default, if an Error object is passed to `ProjectError`, that
`Error` instance will be passed through as `ProjectError.cause` and that
instance's `Error.message` will be passed through as
`ProjectError.message`.

Use this option to override this default behavior and instead set
`ProjectError.cause` manually.
