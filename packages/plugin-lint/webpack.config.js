'use strict';

module.exports = {
  cli: true,
  'cjs-static': (config) => {
    config.entry['index'] = `${__dirname}/src/index.ts`;
  }
};
