/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the config/*.js version of
* ! this file to make permanent modifications!
*/

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanTypes = exports.regenerate = exports.eject = void 0;

require("source-map-support/register");

var _fs = require("fs");

var _util = require("util");

var _gulp = _interopRequireDefault(require("gulp"));

var _gulpTap = _interopRequireDefault(require("gulp-tap"));

var _del = _interopRequireDefault(require("del"));

var _fancyLog = _interopRequireDefault(require("fancy-log"));

var _parseGitignore = _interopRequireDefault(require("parse-gitignore"));

var _core = require("@babel/core");

var _path = require("path");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _replaceInFile = _interopRequireDefault(require("replace-in-file"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

_shelljs.default.config.silent = true;
_shelljs.default.config.fatal = true;
const paths = {};
paths.flowTyped = 'flow-typed';
paths.flowTypedGitIgnore = `${paths.flowTyped}/.gitignore`;
paths.configs = 'config';
paths.packageJson = 'package.json';
paths.launchJson = '.vscode/launch.json';
paths.launchJsonDist = '.vscode/launch.dist.json';
paths.env = '.env';
paths.envDist = 'dist.env';
paths.gitProjectDir = '.git';
paths.gitIgnore = '.gitignore';
paths.packageLockJson = 'package-lock.json';
paths.regenTargets = [`${paths.configs}/*.js`];
const CLI_BANNER = `/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the config/*.js version of
* ! this file to make permanent modifications!
*/\n\n`;
const readFileAsync = (0, _util.promisify)(_fs.readFile);

const cleanTypes = async () => {
  const targets = (0, _parseGitignore.default)((await readFileAsync(paths.flowTypedGitIgnore)));
  (0, _fancyLog.default)(`Deletion targets @ ${paths.flowTyped}/: "${targets.join('" "')}"`);
  (0, _del.default)(targets, {
    cwd: paths.flowTyped
  });
};

exports.cleanTypes = cleanTypes;
cleanTypes.description = `Resets the ${paths.flowTyped} directory to a pristine state`;

const regenerate = () => {
  (0, _fancyLog.default)(`Regenerating targets: "${paths.regenTargets.join('" "')}"`);
  process.env.BABEL_ENV = 'generator';
  return _gulp.default.src(paths.regenTargets).pipe((0, _gulpTap.default)(file => file.contents = Buffer.from(CLI_BANNER + (0, _core.transformSync)(file.contents.toString(), {
    sourceFileName: (0, _path.relative)(__dirname, file.path)
  }).code))).pipe(_gulp.default.dest('.'));
};

exports.regenerate = regenerate;
regenerate.description = 'Invokes babel on the files in config, transpiling them into their project root versions';

const eject = () => _inquirer.default.prompt([{
  type: 'input',
  name: 'package.name',
  message: '[package.json] Specify name for this project (must be valid as a directory name)'
}, {
  type: 'input',
  name: 'package.desc',
  message: '[package.json] Very briefly describe this project'
}, {
  type: 'input',
  name: 'package.repo.url',
  message: '[package.json] Specify a git repository URL'
}, {
  type: 'input',
  name: 'debug.address',
  message: '[launch.json] Specify your dev/remote/server ip address (the one running node)',
  default: '192.168.115.5'
}, {
  type: 'input',
  name: 'debug.url',
  message: '[launch.json] Specify the URL entry point for your application',
  default: 'http://dev.local:80'
}, {
  type: 'input',
  name: 'debug.remoteRoot',
  message: "[launch.json] Specify an *absolute* path to this project's root on remote/server"
}, {
  type: 'confirm',
  name: 'installTypes',
  message: 'Do you want to install Flow types for all local packages?',
  default: true
}, {
  type: 'confirm',
  name: 'confirm',
  message: 'Does everything look good?',
  default: false
}]).then(async answers => {
  if (!answers.confirm) return _fancyLog.default.error('Task aborted!');

  try {
    _fancyLog.default.info(`Moving ${paths.envDist} -> ${paths.env}`);

    _shelljs.default.mv(paths.envDist, paths.env);

    _fancyLog.default.info(`Moving ${paths.launchJsonDist} -> ${paths.launchJson}`);

    _shelljs.default.mv(paths.launchJsonDist, paths.launchJson);

    _fancyLog.default.info(`Mutating ${paths.packageJson}`);

    const delta1 = await (0, _replaceInFile.default)({
      files: paths.packageJson,
      from: [/("name": ?)".*?"/g, /("description": ?)".*?"/g, /("url": ?)".*?"/g],
      to: [`$1"${answers.package.name}"`, `$1"${answers.package.desc}"`, `$1"${answers.package.repo.url}"`]
    });

    _fancyLog.default.info(`Mutating ${paths.launchJson}`);

    const delta2 = await (0, _replaceInFile.default)({
      files: paths.launchJson,
      from: [/("address": ?)".*?"/g, /("remoteRoot": ?)".*?"/g, /("url": ?)".*?"/g],
      to: [`$1"${answers.debug.address}"`, `$1"${answers.debug.remoteRoot}"`, `$1"${answers.debug.url}"`]
    });

    _fancyLog.default.info(`Mutating ${paths.gitIgnore}`);

    const delta3 = await (0, _replaceInFile.default)({
      files: paths.gitIgnore,
      from: 'package-lock.json',
      to: ''
    });
    if (!delta1.length) throw new Error(`There was an error attempting to access "${paths.packageJson}"`);
    if (!delta2.length) throw new Error(`There was an error attempting to access "${paths.launchJson}"`);
    if (!delta3.length) throw new Error(`There was an error attempting to access "${paths.gitignore}"`);

    if (answers.installTypes) {
      _fancyLog.default.info(`Installing flow types (please be patient)`);

      _shelljs.default.exec('npm run install-types');
    }

    _fancyLog.default.info(`Removing ${paths.packageLockJson}`);

    _shelljs.default.rm('-f', paths.packageLockJson);

    _fancyLog.default.info('Removing boilerplate git repository');

    _shelljs.default.rm('-rf', '.git');

    _fancyLog.default.info('Initializing new git repository');

    _shelljs.default.exec('git init');

    _fancyLog.default.info(`Renaming project dir to ${answers.package.name}`);

    _shelljs.default.exec(`cd .. && mv '${(0, _path.parse)(__dirname).name}' '${answers.package.name}'`);

    _fancyLog.default.info(_chalk.default.green('Boilerplate ejection completed successfully!'));

    (0, _fancyLog.default)(`Next steps:\n\t- If you're going to host this project on Github/Gitlab, begin that process now\n\t- Check over package.json for accuracy; remove any unnecessary dependencies/devDependencies and run scripts\n\t- Check over your VS Code launch configuration if you plan on using it\n\t- Look over .env and configure it to your liking\n\t- Your Gulp file is at config/gulpfile.js (and not the project root). Feel free to customize it!\n`);
  } catch (err) {
    _fancyLog.default.error(_chalk.default.red(`ERROR: ${err.toString()}`));
  }
});

exports.eject = eject;
eject.description = 'Assists in configuring the boilerplate to be something useful';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy9ndWxwZmlsZS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwic2giLCJzaWxlbnQiLCJmYXRhbCIsInBhdGhzIiwiZmxvd1R5cGVkIiwiZmxvd1R5cGVkR2l0SWdub3JlIiwiY29uZmlncyIsInBhY2thZ2VKc29uIiwibGF1bmNoSnNvbiIsImxhdW5jaEpzb25EaXN0IiwiZW52IiwiZW52RGlzdCIsImdpdFByb2plY3REaXIiLCJnaXRJZ25vcmUiLCJwYWNrYWdlTG9ja0pzb24iLCJyZWdlblRhcmdldHMiLCJDTElfQkFOTkVSIiwicmVhZEZpbGVBc3luYyIsInJlYWRGaWxlIiwiY2xlYW5UeXBlcyIsInRhcmdldHMiLCJqb2luIiwiY3dkIiwiZGVzY3JpcHRpb24iLCJyZWdlbmVyYXRlIiwicHJvY2VzcyIsIkJBQkVMX0VOViIsImd1bHAiLCJzcmMiLCJwaXBlIiwiZmlsZSIsImNvbnRlbnRzIiwiQnVmZmVyIiwiZnJvbSIsInRvU3RyaW5nIiwic291cmNlRmlsZU5hbWUiLCJfX2Rpcm5hbWUiLCJwYXRoIiwiY29kZSIsImRlc3QiLCJlamVjdCIsInRlcm0iLCJwcm9tcHQiLCJ0eXBlIiwibmFtZSIsIm1lc3NhZ2UiLCJkZWZhdWx0IiwidGhlbiIsImFuc3dlcnMiLCJjb25maXJtIiwibG9nIiwiZXJyb3IiLCJpbmZvIiwibXYiLCJkZWx0YTEiLCJmaWxlcyIsInRvIiwicGFja2FnZSIsImRlc2MiLCJyZXBvIiwidXJsIiwiZGVsdGEyIiwiZGVidWciLCJhZGRyZXNzIiwicmVtb3RlUm9vdCIsImRlbHRhMyIsImxlbmd0aCIsIkVycm9yIiwiZ2l0aWdub3JlIiwiaW5zdGFsbFR5cGVzIiwiZXhlYyIsInJtIiwiY2hhbGsiLCJncmVlbiIsImVyciIsInJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBU0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FB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SUFBSyxFQUF6RDs7QUFDQTVDLHFCQUFHc0UsSUFBSCxDQUFTLGdCQUFlLGlCQUFVbEMsU0FBVixFQUFxQlEsSUFBSyxNQUFLSSxPQUFPLENBQUNTLE9BQVIsQ0FBZ0JiLElBQUssR0FBNUU7O0FBRUFNLHNCQUFJRSxJQUFKLENBQVNvQixlQUFNQyxLQUFOLENBQVksOENBQVosQ0FBVDs7QUFDQSwyQkFBSyxtYkFBTDtBQUNILEdBekRELENBMkRBLE9BQU1DLEdBQU4sRUFBVztBQUNQeEIsc0JBQUlDLEtBQUosQ0FBVXFCLGVBQU1HLEdBQU4sQ0FBVyxVQUFTRCxHQUFHLENBQUN4QyxRQUFKLEVBQWUsRUFBbkMsQ0FBVjtBQUNIO0FBQ0osQ0EvR21CLENBQXBCOzs7QUFpSEFNLEtBQUssQ0FBQ2pCLFdBQU4sR0FBb0IsK0RBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLy8gPyBUbyByZWdlbmVyYXRlIHRoaXMgZmlsZSAoaS5lLiBpZiB5b3UgY2hhbmdlZCBpdCBhbmQgd2FudCB5b3VyIGNoYW5nZXMgdG9cbi8vID8gYmUgcGVybWFuZW50KSwgY2FsbCBgbnBtIHJ1biByZWdlbmVyYXRlYCBhZnRlcndhcmRzXG5cbi8vICEgQmUgc3VyZSB0aGF0IHRhc2tzIGV4cGVjdGVkIHRvIHJ1biBvbiBucG0gaW5zdGFsbCAobWFya2VkIEBkZXBlbmRlbnQpIGhhdmVcbi8vICEgYWxsIHJlcXVpcmVkIHBhY2thZ2VzIGxpc3RlZCB1bmRlciBcImRlcGVuZGVuY2llc1wiIGluc3RlYWQgb2Zcbi8vICEgXCJkZXZEZXBlbmRlbmNpZXNcIiBpbiB0aGlzIHByb2plY3QncyBwYWNrYWdlLmpzb25cblxuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdmcydcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXG5pbXBvcnQgZ3VscCBmcm9tICdndWxwJ1xuaW1wb3J0IHRhcCBmcm9tICdndWxwLXRhcCdcbmltcG9ydCBkZWwgZnJvbSAnZGVsJ1xuaW1wb3J0IGxvZyBmcm9tICdmYW5jeS1sb2cnXG5pbXBvcnQgcGFyc2VHaXRJZ25vcmUgZnJvbSAncGFyc2UtZ2l0aWdub3JlJ1xuaW1wb3J0IHsgdHJhbnNmb3JtU3luYyBhcyBiYWJlbCB9IGZyb20gJ0BiYWJlbC9jb3JlJ1xuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VQYXRoLCByZWxhdGl2ZSBhcyByZWxQYXRoIH0gZnJvbSAncGF0aCdcbmltcG9ydCB0ZXJtIGZyb20gJ2lucXVpcmVyJ1xuaW1wb3J0IHJlcGxhY2VJbkZpbGUgZnJvbSAncmVwbGFjZS1pbi1maWxlJ1xuaW1wb3J0IHNoIGZyb20gJ3NoZWxsanMnXG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnXG5cbnJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZygpO1xuXG5zaC5jb25maWcuc2lsZW50ID0gdHJ1ZTtcbnNoLmNvbmZpZy5mYXRhbCA9IHRydWU7XG5cbmNvbnN0IHBhdGhzID0ge307XG5cbnBhdGhzLmZsb3dUeXBlZCA9ICdmbG93LXR5cGVkJztcbnBhdGhzLmZsb3dUeXBlZEdpdElnbm9yZSA9IGAke3BhdGhzLmZsb3dUeXBlZH0vLmdpdGlnbm9yZWA7XG5wYXRocy5jb25maWdzID0gJ2NvbmZpZyc7XG5wYXRocy5wYWNrYWdlSnNvbiA9ICdwYWNrYWdlLmpzb24nO1xucGF0aHMubGF1bmNoSnNvbiA9ICcudnNjb2RlL2xhdW5jaC5qc29uJztcbnBhdGhzLmxhdW5jaEpzb25EaXN0ID0gJy52c2NvZGUvbGF1bmNoLmRpc3QuanNvbic7XG5wYXRocy5lbnYgPSAnLmVudic7XG5wYXRocy5lbnZEaXN0ID0gJ2Rpc3QuZW52JztcbnBhdGhzLmdpdFByb2plY3REaXIgPSAnLmdpdCc7XG5wYXRocy5naXRJZ25vcmUgPSAnLmdpdGlnbm9yZSc7XG5wYXRocy5wYWNrYWdlTG9ja0pzb24gPSAncGFja2FnZS1sb2NrLmpzb24nO1xuXG5wYXRocy5yZWdlblRhcmdldHMgPSBbXG4gICAgYCR7cGF0aHMuY29uZmlnc30vKi5qc2Bcbl07XG5cbmNvbnN0IENMSV9CQU5ORVIgPSBgLyoqXG4qICEhISBETyBOT1QgRURJVCBUSElTIEZJTEUgRElSRUNUTFkgISEhXG4qICEgVGhpcyBmaWxlIGhhcyBiZWVuIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5LiBTZWUgdGhlIGNvbmZpZy8qLmpzIHZlcnNpb24gb2ZcbiogISB0aGlzIGZpbGUgdG8gbWFrZSBwZXJtYW5lbnQgbW9kaWZpY2F0aW9ucyFcbiovXFxuXFxuYDtcblxuY29uc3QgcmVhZEZpbGVBc3luYyA9IHByb21pc2lmeShyZWFkRmlsZSk7XG5cbi8vICogQ0xFQU5UWVBFU1xuXG5jb25zdCBjbGVhblR5cGVzID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldHMgPSBwYXJzZUdpdElnbm9yZShhd2FpdCByZWFkRmlsZUFzeW5jKHBhdGhzLmZsb3dUeXBlZEdpdElnbm9yZSkpO1xuXG4gICAgbG9nKGBEZWxldGlvbiB0YXJnZXRzIEAgJHtwYXRocy5mbG93VHlwZWR9LzogXCIke3RhcmdldHMuam9pbignXCIgXCInKX1cImApO1xuICAgIGRlbCh0YXJnZXRzLCB7IGN3ZDogcGF0aHMuZmxvd1R5cGVkIH0pO1xufTtcblxuY2xlYW5UeXBlcy5kZXNjcmlwdGlvbiA9IGBSZXNldHMgdGhlICR7cGF0aHMuZmxvd1R5cGVkfSBkaXJlY3RvcnkgdG8gYSBwcmlzdGluZSBzdGF0ZWA7XG5cbi8vICogUkVHRU5FUkFURVxuXG4vLyA/IElmIHlvdSBjaGFuZ2UgdGhpcyBmdW5jdGlvbiwgcnVuIGBucG0gcnVuIHJlZ2VuZXJhdGVgIHR3aWNlOiBvbmNlIHRvXG4vLyA/IGNvbXBpbGUgdGhpcyBuZXcgZnVuY3Rpb24gYW5kIG9uY2UgYWdhaW4gdG8gY29tcGlsZSBpdHNlbGYgd2l0aCB0aGUgbmV3bHlcbi8vID8gY29tcGlsZWQgbG9naWMuIElmIHRoZXJlIGlzIGFuIGVycm9yIHRoYXQgcHJldmVudHMgcmVnZW5lcmF0aW9uLCB5b3UgY2FuXG4vLyA/IHJ1biBgbnBtIHJ1biBnZW5lcmF0ZWAgdGhlbiBgbnBtIHJ1biByZWdlbmVyYXRlYCBpbnN0ZWFkLlxuY29uc3QgcmVnZW5lcmF0ZSA9ICgpID0+IHtcbiAgICBsb2coYFJlZ2VuZXJhdGluZyB0YXJnZXRzOiBcIiR7cGF0aHMucmVnZW5UYXJnZXRzLmpvaW4oJ1wiIFwiJyl9XCJgKTtcblxuICAgIHByb2Nlc3MuZW52LkJBQkVMX0VOViA9ICdnZW5lcmF0b3InO1xuXG4gICAgcmV0dXJuIGd1bHAuc3JjKHBhdGhzLnJlZ2VuVGFyZ2V0cylcbiAgICAgICAgICAgICAgIC5waXBlKHRhcChmaWxlID0+IGZpbGUuY29udGVudHMgPSBCdWZmZXIuZnJvbShDTElfQkFOTkVSICsgYmFiZWwoZmlsZS5jb250ZW50cy50b1N0cmluZygpLCB7XG4gICAgICAgICAgICAgICAgICAgc291cmNlRmlsZU5hbWU6IHJlbFBhdGgoX19kaXJuYW1lLCBmaWxlLnBhdGgpXG4gICAgICAgICAgICAgICB9KS5jb2RlKSkpXG4gICAgICAgICAgICAgICAucGlwZShndWxwLmRlc3QoJy4nKSk7XG59O1xuXG5yZWdlbmVyYXRlLmRlc2NyaXB0aW9uID0gJ0ludm9rZXMgYmFiZWwgb24gdGhlIGZpbGVzIGluIGNvbmZpZywgdHJhbnNwaWxpbmcgdGhlbSBpbnRvIHRoZWlyIHByb2plY3Qgcm9vdCB2ZXJzaW9ucyc7XG5cbi8vICogRUpFQ1RcblxuY29uc3QgZWplY3QgPSAoKSA9PiB0ZXJtLnByb21wdChbXG4gICAge1xuICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICBuYW1lOiAncGFja2FnZS5uYW1lJyxcbiAgICAgICAgbWVzc2FnZTogJ1twYWNrYWdlLmpzb25dIFNwZWNpZnkgbmFtZSBmb3IgdGhpcyBwcm9qZWN0IChtdXN0IGJlIHZhbGlkIGFzIGEgZGlyZWN0b3J5IG5hbWUpJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICBuYW1lOiAncGFja2FnZS5kZXNjJyxcbiAgICAgICAgbWVzc2FnZTogJ1twYWNrYWdlLmpzb25dIFZlcnkgYnJpZWZseSBkZXNjcmliZSB0aGlzIHByb2plY3QnLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICBuYW1lOiAncGFja2FnZS5yZXBvLnVybCcsXG4gICAgICAgIG1lc3NhZ2U6ICdbcGFja2FnZS5qc29uXSBTcGVjaWZ5IGEgZ2l0IHJlcG9zaXRvcnkgVVJMJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICBuYW1lOiAnZGVidWcuYWRkcmVzcycsXG4gICAgICAgIG1lc3NhZ2U6ICdbbGF1bmNoLmpzb25dIFNwZWNpZnkgeW91ciBkZXYvcmVtb3RlL3NlcnZlciBpcCBhZGRyZXNzICh0aGUgb25lIHJ1bm5pbmcgbm9kZSknLFxuICAgICAgICBkZWZhdWx0OiAnMTkyLjE2OC4xMTUuNSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgICAgbmFtZTogJ2RlYnVnLnVybCcsXG4gICAgICAgIG1lc3NhZ2U6ICdbbGF1bmNoLmpzb25dIFNwZWNpZnkgdGhlIFVSTCBlbnRyeSBwb2ludCBmb3IgeW91ciBhcHBsaWNhdGlvbicsXG4gICAgICAgIGRlZmF1bHQ6ICdodHRwOi8vZGV2LmxvY2FsOjgwJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICBuYW1lOiAnZGVidWcucmVtb3RlUm9vdCcsXG4gICAgICAgIG1lc3NhZ2U6IFwiW2xhdW5jaC5qc29uXSBTcGVjaWZ5IGFuICphYnNvbHV0ZSogcGF0aCB0byB0aGlzIHByb2plY3QncyByb290IG9uIHJlbW90ZS9zZXJ2ZXJcIlxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnY29uZmlybScsXG4gICAgICAgIG5hbWU6ICdpbnN0YWxsVHlwZXMnLFxuICAgICAgICBtZXNzYWdlOiAnRG8geW91IHdhbnQgdG8gaW5zdGFsbCBGbG93IHR5cGVzIGZvciBhbGwgbG9jYWwgcGFja2FnZXM/JyxcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnY29uZmlybScsXG4gICAgICAgIG5hbWU6ICdjb25maXJtJyxcbiAgICAgICAgbWVzc2FnZTogJ0RvZXMgZXZlcnl0aGluZyBsb29rIGdvb2Q/JyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9XG5dKS50aGVuKGFzeW5jIGFuc3dlcnMgPT4ge1xuICAgIGlmKCFhbnN3ZXJzLmNvbmZpcm0pXG4gICAgICAgIHJldHVybiBsb2cuZXJyb3IoJ1Rhc2sgYWJvcnRlZCEnKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGxvZy5pbmZvKGBNb3ZpbmcgJHtwYXRocy5lbnZEaXN0fSAtPiAke3BhdGhzLmVudn1gKTtcbiAgICAgICAgc2gubXYocGF0aHMuZW52RGlzdCwgcGF0aHMuZW52KTtcblxuICAgICAgICBsb2cuaW5mbyhgTW92aW5nICR7cGF0aHMubGF1bmNoSnNvbkRpc3R9IC0+ICR7cGF0aHMubGF1bmNoSnNvbn1gKTtcbiAgICAgICAgc2gubXYocGF0aHMubGF1bmNoSnNvbkRpc3QsIHBhdGhzLmxhdW5jaEpzb24pO1xuXG4gICAgICAgIGxvZy5pbmZvKGBNdXRhdGluZyAke3BhdGhzLnBhY2thZ2VKc29ufWApO1xuICAgICAgICBjb25zdCBkZWx0YTEgPSBhd2FpdCByZXBsYWNlSW5GaWxlKHtcbiAgICAgICAgICAgIGZpbGVzOiBwYXRocy5wYWNrYWdlSnNvbixcbiAgICAgICAgICAgIGZyb206IFsvKFwibmFtZVwiOiA/KVwiLio/XCIvZywgLyhcImRlc2NyaXB0aW9uXCI6ID8pXCIuKj9cIi9nLCAvKFwidXJsXCI6ID8pXCIuKj9cIi9nXSxcbiAgICAgICAgICAgIHRvOiBbYCQxXCIke2Fuc3dlcnMucGFja2FnZS5uYW1lfVwiYCwgYCQxXCIke2Fuc3dlcnMucGFja2FnZS5kZXNjfVwiYCwgYCQxXCIke2Fuc3dlcnMucGFja2FnZS5yZXBvLnVybH1cImBdLFxuICAgICAgICB9KTtcblxuICAgICAgICBsb2cuaW5mbyhgTXV0YXRpbmcgJHtwYXRocy5sYXVuY2hKc29ufWApO1xuICAgICAgICBjb25zdCBkZWx0YTIgPSBhd2FpdCByZXBsYWNlSW5GaWxlKHtcbiAgICAgICAgICAgIGZpbGVzOiBwYXRocy5sYXVuY2hKc29uLFxuICAgICAgICAgICAgZnJvbTogWy8oXCJhZGRyZXNzXCI6ID8pXCIuKj9cIi9nLCAvKFwicmVtb3RlUm9vdFwiOiA/KVwiLio/XCIvZywgLyhcInVybFwiOiA/KVwiLio/XCIvZ10sXG4gICAgICAgICAgICB0bzogW2AkMVwiJHthbnN3ZXJzLmRlYnVnLmFkZHJlc3N9XCJgLCBgJDFcIiR7YW5zd2Vycy5kZWJ1Zy5yZW1vdGVSb290fVwiYCwgYCQxXCIke2Fuc3dlcnMuZGVidWcudXJsfVwiYF0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxvZy5pbmZvKGBNdXRhdGluZyAke3BhdGhzLmdpdElnbm9yZX1gKTtcbiAgICAgICAgY29uc3QgZGVsdGEzID0gYXdhaXQgcmVwbGFjZUluRmlsZSh7XG4gICAgICAgICAgICBmaWxlczogcGF0aHMuZ2l0SWdub3JlLFxuICAgICAgICAgICAgZnJvbTogJ3BhY2thZ2UtbG9jay5qc29uJyxcbiAgICAgICAgICAgIHRvOiAnJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYoIWRlbHRhMS5sZW5ndGgpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIHdhcyBhbiBlcnJvciBhdHRlbXB0aW5nIHRvIGFjY2VzcyBcIiR7cGF0aHMucGFja2FnZUpzb259XCJgKTtcblxuICAgICAgICBpZighZGVsdGEyLmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgd2FzIGFuIGVycm9yIGF0dGVtcHRpbmcgdG8gYWNjZXNzIFwiJHtwYXRocy5sYXVuY2hKc29ufVwiYCk7XG5cbiAgICAgICAgaWYoIWRlbHRhMy5sZW5ndGgpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIHdhcyBhbiBlcnJvciBhdHRlbXB0aW5nIHRvIGFjY2VzcyBcIiR7cGF0aHMuZ2l0aWdub3JlfVwiYCk7XG5cbiAgICAgICAgaWYoYW5zd2Vycy5pbnN0YWxsVHlwZXMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxvZy5pbmZvKGBJbnN0YWxsaW5nIGZsb3cgdHlwZXMgKHBsZWFzZSBiZSBwYXRpZW50KWApO1xuICAgICAgICAgICAgc2guZXhlYygnbnBtIHJ1biBpbnN0YWxsLXR5cGVzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsb2cuaW5mbyhgUmVtb3ZpbmcgJHtwYXRocy5wYWNrYWdlTG9ja0pzb259YCk7XG4gICAgICAgIHNoLnJtKCctZicsIHBhdGhzLnBhY2thZ2VMb2NrSnNvbik7XG5cbiAgICAgICAgbG9nLmluZm8oJ1JlbW92aW5nIGJvaWxlcnBsYXRlIGdpdCByZXBvc2l0b3J5Jyk7XG4gICAgICAgIHNoLnJtKCctcmYnLCAnLmdpdCcpO1xuXG4gICAgICAgIGxvZy5pbmZvKCdJbml0aWFsaXppbmcgbmV3IGdpdCByZXBvc2l0b3J5Jyk7XG4gICAgICAgIHNoLmV4ZWMoJ2dpdCBpbml0Jyk7XG5cbiAgICAgICAgbG9nLmluZm8oYFJlbmFtaW5nIHByb2plY3QgZGlyIHRvICR7YW5zd2Vycy5wYWNrYWdlLm5hbWV9YCk7XG4gICAgICAgIHNoLmV4ZWMoYGNkIC4uICYmIG12ICcke3BhcnNlUGF0aChfX2Rpcm5hbWUpLm5hbWV9JyAnJHthbnN3ZXJzLnBhY2thZ2UubmFtZX0nYCk7XG5cbiAgICAgICAgbG9nLmluZm8oY2hhbGsuZ3JlZW4oJ0JvaWxlcnBsYXRlIGVqZWN0aW9uIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHkhJykpO1xuICAgICAgICBsb2coYE5leHQgc3RlcHM6XFxuXFx0LSBJZiB5b3UncmUgZ29pbmcgdG8gaG9zdCB0aGlzIHByb2plY3Qgb24gR2l0aHViL0dpdGxhYiwgYmVnaW4gdGhhdCBwcm9jZXNzIG5vd1xcblxcdC0gQ2hlY2sgb3ZlciBwYWNrYWdlLmpzb24gZm9yIGFjY3VyYWN5OyByZW1vdmUgYW55IHVubmVjZXNzYXJ5IGRlcGVuZGVuY2llcy9kZXZEZXBlbmRlbmNpZXMgYW5kIHJ1biBzY3JpcHRzXFxuXFx0LSBDaGVjayBvdmVyIHlvdXIgVlMgQ29kZSBsYXVuY2ggY29uZmlndXJhdGlvbiBpZiB5b3UgcGxhbiBvbiB1c2luZyBpdFxcblxcdC0gTG9vayBvdmVyIC5lbnYgYW5kIGNvbmZpZ3VyZSBpdCB0byB5b3VyIGxpa2luZ1xcblxcdC0gWW91ciBHdWxwIGZpbGUgaXMgYXQgY29uZmlnL2d1bHBmaWxlLmpzIChhbmQgbm90IHRoZSBwcm9qZWN0IHJvb3QpLiBGZWVsIGZyZWUgdG8gY3VzdG9taXplIGl0IVxcbmApO1xuICAgIH1cblxuICAgIGNhdGNoKGVycikge1xuICAgICAgICBsb2cuZXJyb3IoY2hhbGsucmVkKGBFUlJPUjogJHtlcnIudG9TdHJpbmcoKX1gKSk7XG4gICAgfVxufSk7XG5cbmVqZWN0LmRlc2NyaXB0aW9uID0gJ0Fzc2lzdHMgaW4gY29uZmlndXJpbmcgdGhlIGJvaWxlcnBsYXRlIHRvIGJlIHNvbWV0aGluZyB1c2VmdWwnO1xuXG5leHBvcnQgeyBlamVjdCwgcmVnZW5lcmF0ZSwgY2xlYW5UeXBlcyB9O1xuIl19