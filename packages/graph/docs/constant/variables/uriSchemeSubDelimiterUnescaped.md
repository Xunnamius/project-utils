[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [constant](../README.md) / uriSchemeSubDelimiterUnescaped

# Variable: uriSchemeSubDelimiterUnescaped

> `const` **uriSchemeSubDelimiterUnescaped**: `"+"` = `'+'`

Defined in: [packages/graph/src/constant.ts:32](https://github.com/Xunnamius/projector/blob/8083fdfb8119466a16efa45bfe532af41d9ff256/packages/graph/src/constant.ts#L32)

```text
            v
URI = scheme+sub-scheme ":" ["//" authority] path ["?" query] ["#" fragment]
            ^
```

Note that this delimiter is not escaped for use in regular expressions.

## See

https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
