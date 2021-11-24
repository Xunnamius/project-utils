'use strict';

const configure = (config) => {
  config.entry['import-aliases'] = `${__dirname}/src/import-aliases.ts`;
  config.entry['monorepo-utils'] = `${__dirname}/src/monorepo-utils.ts`;
  return config;
};

module.exports = {
  cjs: configure,
  esm: configure
};
