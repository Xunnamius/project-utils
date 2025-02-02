[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / PseudodecoratorTag

# Enumeration: PseudodecoratorTag

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.d.ts:7

The available [Pseudodecorator](../type-aliases/Pseudodecorator.md) tags. These tags must not contain valid
RegExp quantifiers or other RegExp control characters.

## Enumeration Members

### NotExtraneous

> **NotExtraneous**: `"@symbiote/notExtraneous"`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.d.ts:16

This pseudodecorator provides a list of package names that should not be
considered extraneous (the relevant checks are skipped).

**Valid characters**: any character that is valid in an NPM package name.\
**Invalid characters**: whitespace and any character that isn't valid in an
NPM package name.

***

### NotInvalid

> **NotInvalid**: `"@symbiote/notInvalid"`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.d.ts:25

This pseudodecorator provides a list of package names that should not be
considered invalid (the relevant checks are skipped).

**Valid characters**: any character that is valid in an NPM package name.\
**Invalid characters**: whitespace and any character that isn't valid in an
NPM package name.
