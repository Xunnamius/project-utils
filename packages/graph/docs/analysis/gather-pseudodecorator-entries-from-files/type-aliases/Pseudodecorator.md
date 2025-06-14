[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-pseudodecorator-entries-from-files](../README.md) / Pseudodecorator

# Type Alias: Pseudodecorator

> **Pseudodecorator** = `object`

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:125](https://github.com/Xunnamius/projector/blob/929f57e95906b9d431b526feb4b0c2cf7ee47730/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L125)

A so-called "pseudodecorator" is a decorator-like syntax that can appear
anywhere in almost any type of file and is used to pass information to
symbiote. They consist of an opening brace "{", a [PseudodecoratorTag](../enumerations/PseudodecoratorTag.md),
an optional delimiter, a _delimited_ list of _valid characters_, an optional
delimiter, and a closing brace "}".

A "delimiter" is a _series_ of one or more invalid characters that starts and
ends with a whitespace character or the final "}" character. This flexible
syntax allows pseudodecorators to survive being nested anywhere within almost
any document or file type without corruption. Which characters are valid and
which are invalid depend on the [PseudodecoratorTag](../enumerations/PseudodecoratorTag.md) used.

For example, using the `@symbiote/notExtraneous` pseudodecorator:

**TypeScript:**

```typescript
/·*
 * {@symbiote/notExtraneous
 *   all-contributors-cli remark-cli
 *   jest husky
 *   doctoc
 * }
 ·/

import { that } from 'there';

export function someFunction() {
  // ...
}
```

**JavaScript:**

```javascript
// {@symbiote/notExtraneous
//  - all-contributors-cli
//  - remark-cli
//  - jest
//  - husky
//  - doctoc
// }

import { that } from 'there';

export function someFunction() {
  // ...
}
```

**JSON:**

```json
{
  "name": "my-package",
  "//": "{@symbiote/notExtraneous all-contributors-cli remark-cli jest husky doctoc}"
}
```

**Markdown:**

```markdown
# My Documentation
Something or other.

<!-- {@symbiote/notExtraneous all-contributors-cli remark-cli jest husky doctoc } -->

## A Subsection
More text.
```

**And any other type of file** that can contain text. See [the
docs](https://github.com/Xunnamius/symbiote/wiki/Generic-Project-Architecture)
for more details.

## See

[PseudodecoratorTag](../enumerations/PseudodecoratorTag.md)

## Properties

### items

> **items**: `string`[]

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:127](https://github.com/Xunnamius/projector/blob/929f57e95906b9d431b526feb4b0c2cf7ee47730/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L127)

***

### tag

> **tag**: [`PseudodecoratorTag`](../enumerations/PseudodecoratorTag.md)

Defined in: [packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts:126](https://github.com/Xunnamius/projector/blob/929f57e95906b9d431b526feb4b0c2cf7ee47730/packages/graph/src/analysis/gather-pseudodecorator-entries-from-files.ts#L126)
