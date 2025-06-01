[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-pseudodecorator-entries-from-files](../README.md) / PseudodecoratorTag

# Enumeration: PseudodecoratorTag

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:24](https://github.com/Xunnamius/projector/blob/7607517f14ad401cf959467e106fee9dead50bb3/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L24)

The available [Pseudodecorator](../type-aliases/Pseudodecorator.md) tags. These tags must not contain valid
RegExp quantifiers or other RegExp control characters.

## Enumeration Members

### NotExtraneous

> **NotExtraneous**: `"@symbiote/notExtraneous"`

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:33](https://github.com/Xunnamius/projector/blob/7607517f14ad401cf959467e106fee9dead50bb3/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L33)

This pseudodecorator provides a list of package names that should not be
considered extraneous (the relevant checks are skipped).

**Valid characters**: any character that is valid in an NPM package name.\
**Invalid characters**: whitespace and any character that isn't valid in an
NPM package name.

***

### NotInvalid

> **NotInvalid**: `"@symbiote/notInvalid"`

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:42](https://github.com/Xunnamius/projector/blob/7607517f14ad401cf959467e106fee9dead50bb3/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L42)

This pseudodecorator provides a list of package names that should not be
considered invalid (the relevant checks are skipped).

**Valid characters**: any character that is valid in an NPM package name.\
**Invalid characters**: whitespace and any character that isn't valid in an
NPM package name.
