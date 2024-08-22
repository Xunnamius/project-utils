[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [project-utils](../README.md) / getRunContext

# Function: getRunContext()

> **getRunContext**(`options`): [`MonorepoRunContext`](../type-aliases/MonorepoRunContext.md) \| [`PolyrepoRunContext`](../type-aliases/PolyrepoRunContext.md)

Returns information about the project structure at the current working
directory.

## Parameters

• **options**= `{}`

• **options.cwd?**: `string`

The current working directory as an absolute path.

**Default**

```ts
process.cwd()
```

## Returns

[`MonorepoRunContext`](../type-aliases/MonorepoRunContext.md) \| [`PolyrepoRunContext`](../type-aliases/PolyrepoRunContext.md)

## Source

[packages/core/src/project-utils.ts:499](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/project-utils.ts#L499)
