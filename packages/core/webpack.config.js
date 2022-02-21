'use strict';

module.exports = {
  'cjs-static': (config) => {
    config.entry['import-aliases'] = `${__dirname}/src/import-aliases.ts`;
    config.entry['monorepo-utils'] = `${__dirname}/src/monorepo-utils.ts`;
  }
};
