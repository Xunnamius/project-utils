'use strict';

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
        if (request.endsWith('./utils')) {
          cb(null, `commonjs ./utils`);
        } else if (request.endsWith('./constants')) {
          cb(null, `commonjs ./constants`);
        } else if (request.endsWith('./errors')) {
          cb(null, `commonjs ./errors`);
        } else cb();
      }
    ];
  }
};
