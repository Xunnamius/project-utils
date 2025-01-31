// @ts-check
'use strict';

const {
  assertEnvironment,
  moduleExport
} = require('@-xun/symbiote/assets/release.config.cjs');

const { createDebugLogger } = require('rejoinder');

const debug = createDebugLogger({ namespace: 'symbiote:config:release' });

module.exports = moduleExport(assertEnvironment({ projectRoot: __dirname }));

debug('exported config: %O', module.exports);
