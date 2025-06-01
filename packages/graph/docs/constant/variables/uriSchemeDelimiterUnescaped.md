[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [constant](../README.md) / uriSchemeDelimiterUnescaped

# Variable: uriSchemeDelimiterUnescaped

> `const` **uriSchemeDelimiterUnescaped**: `":"` = `':'`

Defined in: [packages/graph/src/constant.ts:12](https://github.com/Xunnamius/projector/blob/7607517f14ad401cf959467e106fee9dead50bb3/packages/graph/src/constant.ts#L12)

```text
                         v
URI = scheme+sub-scheme ":" ["//" authority] path ["?" query] ["#" fragment]
                         ^
```

Note that this delimiter is not escaped for use in regular expressions.

## See

https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
