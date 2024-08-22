[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [helpers](../README.md) / getMaintainedNodeVersions

# Function: getMaintainedNodeVersions()

## getMaintainedNodeVersions(options)

> **getMaintainedNodeVersions**(`options`?): `string`

Returns the expected value for `package.json` `node.engines` field

### Parameters

• **options?**

• **options.format?**: `"engines"`

This determines in what format the results are returned. `"engines"`
returns the currently maintained node versions as a string suitable for the
`engines` key in a `package.json` file. `array` returns an array of the
currently maintained node versions.

**Default**

```ts
engines
```

### Returns

`string`

### Source

[packages/core/src/helpers.ts:19](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/helpers.ts#L19)

## getMaintainedNodeVersions(options)

> **getMaintainedNodeVersions**(`options`?): `string`[]

Returns the expected value for `package.json` `node.engines` field

### Parameters

• **options?**

• **options.format?**: `"array"`

This determines in what format the results are returned. `"engines"`
returns the currently maintained node versions as a string suitable for the
`engines` key in a `package.json` file. `array` returns an array of the
currently maintained node versions.

**Default**

```ts
engines
```

### Returns

`string`[]

### Source

[packages/core/src/helpers.ts:33](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/helpers.ts#L33)
