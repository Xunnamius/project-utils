'use strict';

const pkgName = require('./package.json').name;

module.exports = {
  'cjs-static': (config) => {
    config.entry['import-aliases'] = `${__dirname}/src/import-aliases.ts`;
    config.entry['project-utils'] = `${__dirname}/src/project-utils.ts`;
    config.entry['errors'] = `${__dirname}/src/errors.ts`;
    config.externals = [
      ...config.externals,
      // ? Externalize shared local imports
      ({ request }, cb) => {
        if (request.startsWith('./') && request.endsWith('/errors')) {
          cb(null, `commonjs ${pkgName}/errors`);
        } else cb();
      }
    ];
  }
};
