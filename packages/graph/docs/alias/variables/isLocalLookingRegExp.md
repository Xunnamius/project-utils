[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / isLocalLookingRegExp

# Variable: isLocalLookingRegExp

> `const` **isLocalLookingRegExp**: `RegExp`

Defined in: [packages/graph/src/alias.ts:52](https://github.com/Xunnamius/projector/blob/b164ec02958be4a3fc50929ad4f824678a7453d6/packages/graph/src/alias.ts#L52)

A regex that matches any string that looks like a relative path without also
looking like a bare specifier.

**This regular expression must never have the "global" flag**, meaning it is
safe to use with `.test()`.
