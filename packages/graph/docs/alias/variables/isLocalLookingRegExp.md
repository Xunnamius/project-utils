[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / isLocalLookingRegExp

# Variable: isLocalLookingRegExp

> `const` **isLocalLookingRegExp**: `RegExp`

Defined in: [packages/graph/src/alias.ts:52](https://github.com/Xunnamius/projector/blob/9157d42cdc0054cf96a3e2980daba7c8ae5a3e13/packages/graph/src/alias.ts#L52)

A regex that matches any string that looks like a relative path without also
looking like a bare specifier.

**This regular expression must never have the "global" flag**, meaning it is
safe to use with `.test()`.
