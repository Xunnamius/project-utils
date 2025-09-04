[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [constant](../README.md) / uriSchemeDelimiterUnescaped

# Variable: uriSchemeDelimiterUnescaped

> `const` **uriSchemeDelimiterUnescaped**: `":"` = `':'`

Defined in: [packages/graph/src/constant.ts:12](https://github.com/Xunnamius/projector/blob/514ccc0cc29a5be24dff01a84b9935be834df2b5/packages/graph/src/constant.ts#L12)

```text
                         v
URI = scheme+sub-scheme ":" ["//" authority] path ["?" query] ["#" fragment]
                         ^
```

Note that this delimiter is not escaped for use in regular expressions.

## See

https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
