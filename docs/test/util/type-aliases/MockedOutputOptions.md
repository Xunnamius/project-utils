[**@-xun/project**](../../../README.md)

***

[@-xun/project](../../../README.md) / [test/util](../README.md) / MockedOutputOptions

# Type Alias: MockedOutputOptions

> **MockedOutputOptions**: `object`

Defined in: node\_modules/@-xun/test-mock-output/dist/packages/test-mock-output/src/index.d.ts:5

## Type declaration

### passthrough?

> `optional` **passthrough**: (`"log"` \| `"warn"` \| `"error"` \| `"info"` \| `"stdout"` \| `"stderr"`)[]

Call jest.SpyInstance.mockRestore on one or more output functions
currently being spied upon.

### passthroughOutputIfDebugging?

> `optional` **passthroughOutputIfDebugging**: `boolean`

If `true`, whenever `process.env.DEBUG` is present, output functions will
still be spied on but their implementations will not be mocked, allowing
debug output to make it to the screen.

#### Default

```ts
true
```

## See

[withMockedOutput](../functions/withMockedOutput.md)
