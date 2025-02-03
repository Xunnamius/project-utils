[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / isLocalLookingRegExp

# Variable: isLocalLookingRegExp

> `const` **isLocalLookingRegExp**: `RegExp`

Defined in: [packages/graph/src/alias.ts:51](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/alias.ts#L51)

A regex that matches any string that looks like a relative path without also
looking like a bare specifier.

**This regular expression must never have the "global" flag**, meaning it is
safe to use with `.test()`.
