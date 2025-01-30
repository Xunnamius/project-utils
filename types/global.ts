import type { SetReturnType } from 'type-fest';

/**
 * Return a function's parameters array with the first element omitted.
 *
 * @internal
 */
export type ParametersNoFirst<T extends (...args: never) => unknown> =
  Parameters<T> extends [infer _X, ...infer Parameters_] ? Parameters_ : [];

/**
 * Return the synchronous version of a function's call signature.
 */
export type SyncVersionOf<T extends (...args: never) => unknown> = SetReturnType<
  T,
  Awaited<ReturnType<T>>
>;
