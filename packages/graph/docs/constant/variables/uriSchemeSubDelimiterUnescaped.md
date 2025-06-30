[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [constant](../README.md) / uriSchemeSubDelimiterUnescaped

# Variable: uriSchemeSubDelimiterUnescaped

> `const` **uriSchemeSubDelimiterUnescaped**: `"+"` = `'+'`

Defined in: [packages/graph/src/constant.ts:32](https://github.com/Xunnamius/projector/blob/e784a5e8ae5bff24c71e3b35914b446e5dd59fe7/packages/graph/src/constant.ts#L32)

```text
            v
URI = scheme+sub-scheme ":" ["//" authority] path ["?" query] ["#" fragment]
            ^
```

Note that this delimiter is not escaped for use in regular expressions.

## See

https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
