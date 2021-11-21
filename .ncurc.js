// * https://www.npmjs.com/package/npm-check-updates#configuration-files

module.exports = {
  reject: [
    // ? Pin the non-borked version of babel-plugin-add-import-extension
    'babel-plugin-add-import-extension',
    // ? Pin the working version of execa
    'execa'
  ]
};
