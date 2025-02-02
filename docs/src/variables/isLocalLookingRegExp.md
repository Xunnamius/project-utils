[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / isLocalLookingRegExp

# Variable: isLocalLookingRegExp

> `const` **isLocalLookingRegExp**: `RegExp`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:27

A regex that matches any string that looks like a relative path without also
looking like a bare specifier.

**This regular expression must never have the "global" flag**, meaning it is
safe to use with `.test()`.
