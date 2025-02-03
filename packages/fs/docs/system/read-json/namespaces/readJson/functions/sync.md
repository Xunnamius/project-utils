[**@-xun/project-fs**](../../../../../README.md)

***

[@-xun/project-fs](../../../../../README.md) / [system/read-json](../../../README.md) / [readJson](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): `unknown`

Defined in: [packages/fs/src/system/read-json.ts:153](https://github.com/Xunnamius/projector/blob/f1c4cd0ac601a9a5f65f41d830f0ce9a716e9d77/packages/fs/src/system/read-json.ts#L153)

Synchronously read in and parse the contents of an arbitrary JSON file.

Use the template variable (`T`) to bring your own types. Otherwise, it
defaults to JsonValue.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

## Parameters

### arguments\_

...\[`AbsolutePath`, [`ReadJsonOptions`](../../../type-aliases/ReadJsonOptions.md)\]

## Returns

`unknown`
