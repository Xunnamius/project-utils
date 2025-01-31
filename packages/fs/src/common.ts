import { createDebugLogger } from 'rejoinder';

import { globalDebuggerNamespace } from 'multiverse+common:constant.ts';

export const commonDebug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:analyze`
});
