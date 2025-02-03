[**@-xun/project-fs**](../../../../README.md)

***

[@-xun/project-fs](../../../../README.md) / [index](../../../README.md) / [JSONC](../README.md) / EditResult

# Type Alias: EditResult

> **EditResult**: [`Edit`](../interfaces/Edit.md)[]

Defined in: node\_modules/jsonc-parser/lib/umd/main.d.ts:247

An edit result describes a textual edit operation. It is the result of a [`format`](../functions/format.md) and [`modify`](../functions/modify.md) operation.
It consist of one or more edits describing insertions, replacements or removals of text segments.
* The offsets of the edits refer to the original state of the document.
* No two edits change or remove the same range of text in the original document.
* Multiple edits can have the same offset if they are multiple inserts, or an insert followed by a remove or replace.
* The order in the array defines which edit is applied first.
To apply an edit result use [`applyEdits`](../functions/applyEdits.md).
In general multiple EditResults must not be concatenated because they might impact each other, producing incorrect or malformed JSON data.
