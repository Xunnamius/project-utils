/**
 * A collection of possible error and warning messages.
 */

import { ErrorMessage as UpstreamErrorMessage } from 'named-app-errors';

/* istanbul ignore next */
export const ErrorMessage = {
  AssertionFailedWantedPathIsNotSeenPath() {
    return 'assertion failed: wantedPath does not map cleanly to seenPath';
  },
  GuruMeditation: UpstreamErrorMessage.GuruMeditation
};
