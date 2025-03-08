[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [constant](../README.md) / uriSchemeSubDelimiterUnescaped

# Variable: uriSchemeSubDelimiterUnescaped

> `const` **uriSchemeSubDelimiterUnescaped**: `"+"` = `'+'`

Defined in: [packages/graph/src/constant.ts:32](https://github.com/Xunnamius/projector/blob/75b2ac9b21c6609d9b8cc2f9871d2d58f0db3dfa/packages/graph/src/constant.ts#L32)

```text
            v
URI = scheme+sub-scheme ":" ["//" authority] path ["?" query] ["#" fragment]
            ^
```

Note that this delimiter is not escaped for use in regular expressions.

## See

https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
