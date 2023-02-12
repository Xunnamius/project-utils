/**
 * Custom lodash merge customizer that causes source arrays to be concatenated.
 * `undefined` values are always replaced by their defined counterparts (if they
 * exist).
 *
 * @see https://lodash.com/docs/4.17.15#mergeWith
 */
export function concatCustomizer(objValue: unknown, srcValue: unknown) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }

  return undefined;
}

/**
 * Custom lodash merge customizer that causes source arrays to be concatenated
 * and successive `undefined` values to unset (delete) the property if it
 * exists.
 *
 * @see https://lodash.com/docs/4.17.15#mergeWith
 */
export function concatAndUnsetCustomizer(
  objValue: unknown,
  srcValue: unknown,
  key: string,
  object: Record<string, unknown>,
  source: Record<string, unknown>
) {
  if (object && srcValue === undefined && key in source) {
    delete object[key];
  } else if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }

  return undefined;
}

export const Customizer = {
  /**
   * Custom lodash merge customizer that causes source arrays to be concatenated.
   * `undefined` values are always replaced by their defined counterparts (if they
   * exist).
   *
   * @see https://lodash.com/docs/4.17.15#mergeWith
   */
  concat: concatCustomizer,
  /**
   * Custom lodash merge customizer that causes source arrays to be concatenated
   * and successive `undefined` values to unset (delete) the property if it
   * exists.
   *
   * @see https://lodash.com/docs/4.17.15#mergeWith
   */
  concatAndUnset: concatAndUnsetCustomizer
};
