// * https://www.npmjs.com/package/npm-check-updates#configuration-files

module.exports = {
  reject: [
    // ? Pin the CJS version
    'execa',
    // ? Pin the CJS version
    'escape-string-regexp'
  ]
};
