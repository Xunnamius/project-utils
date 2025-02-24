import { CommonErrorMessage } from 'multiverse+common:error.ts';

export * from 'multiverse+common:error.ts';

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const FsErrorMessage = {
  ...CommonErrorMessage,
  NotReadable(path: string) {
    return `"${path}" cannot be read and/or does not exist`;
  },
  NotParsable(path: string, type = 'json') {
    return `${path} cannot be parsed as it does not contain valid ${type}`;
  },
  DeriverAsyncConfigurationConflict() {
    return 'assertion failed: attempted to invoke function with conflicting or illegal configuration options';
  },
  IsNotXPackageJson(path: string) {
    return `${path} content does not constitute a valid XPackageJson instance (is it missing a non-empty "name" field?). See https://github.com/Xunnamius/project-utils/blob/main/packages/types/docs/functions/isXPackageJson.md for details`;
  }
};
