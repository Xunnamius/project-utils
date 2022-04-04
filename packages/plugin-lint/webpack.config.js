'use strict';

const pkgName = require('./package.json').name;

module.exports = {
  cli: true,
  'cjs-static': (config) => {
    config.entry['index'] = `${__dirname}/src/index.ts`;
    config.entry['utils'] = `${__dirname}/src/utils/index.ts`;
    config.entry['constants'] = `${__dirname}/src/constants.ts`;
    config.entry['errors'] = `${__dirname}/src/errors.ts`;

    config.externals = [
      ...config.externals,
      // ? Externalize shared local imports
      ({ request }, cb) => {
        if (request == './utils' || request == '../utils') {
          cb(null, `commonjs ${pkgName}/utils`);
        } else if (request == './constants' || request == '../constants') {
          cb(null, `commonjs ${pkgName}/constants`);
        } else if (request == './errors' || request == '../errors') {
          cb(null, `commonjs ${pkgName}/errors`);
        } else cb();
      }
    ];
  }
};
