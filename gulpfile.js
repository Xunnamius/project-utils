/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the *.babel.js version of
* ! this file to make permanent modifications (in config/)
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shelljs.default.config.silent = true;
_shelljs.default.config.fatal = true;
const paths = {};
const FLOW_TYPES_DIR = 'flow-typed';
paths.flowTypedGitIgnore = `${FLOW_TYPES_DIR}/.gitignore`;
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
* ! This file has been generated automatically. See the *.babel.js version of
* ! this file to make permanent modifications (in config/)
*/\n\n`;
const readFileAsync = (0, _util.promisify)(_fs.readFile);

const cleanTypes = async () => {
  const targets = (0, _parseGitignore.default)((await readFileAsync(paths.flowTypedGitIgnore)));
  (0, _fancyLog.default)(`Deletion targets @ ${FLOW_TYPES_DIR}/: "${targets.join('" "')}"`);
  (0, _del.default)(targets, {
    cwd: FLOW_TYPES_DIR
  });
};

exports.cleanTypes = cleanTypes;
cleanTypes.description = `Resets the ${FLOW_TYPES_DIR} directory to a pristine state`;

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

    _fancyLog.default.info('Boilerplate ejection completed successfully!');

    (0, _fancyLog.default)(`Next steps:\n\t- If you're going to host this project on Github/Gitlab, begin that process now\n\t- Check over package.json for accuracy; remove any unnecessary dependencies/devDependencies\n\t- Check over your vscode launch configuration if you plan on using it\n\t- Look over .env and configure it to your liking\n`);
  } catch (err) {
    _fancyLog.default.error(`ERROR: ${err.toString()}`);
  }
});

exports.eject = eject;
eject.description = 'Assists in configuring the boilerplate to be something useful';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy9ndWxwZmlsZS5qcyJdLCJuYW1lcyI6WyJzaCIsImNvbmZpZyIsInNpbGVudCIsImZhdGFsIiwicGF0aHMiLCJGTE9XX1RZUEVTX0RJUiIsImZsb3dUeXBlZEdpdElnbm9yZSIsImNvbmZpZ3MiLCJwYWNrYWdlSnNvbiIsImxhdW5jaEpzb24iLCJsYXVuY2hKc29uRGlzdCIsImVudiIsImVudkRpc3QiLCJnaXRQcm9qZWN0RGlyIiwiZ2l0SWdub3JlIiwicGFja2FnZUxvY2tKc29uIiwicmVnZW5UYXJnZXRzIiwiQ0xJX0JBTk5FUiIsInJlYWRGaWxlQXN5bmMiLCJyZWFkRmlsZSIsImNsZWFuVHlwZXMiLCJ0YXJnZXRzIiwiam9pbiIsImN3ZCIsImRlc2NyaXB0aW9uIiwicmVnZW5lcmF0ZSIsInByb2Nlc3MiLCJCQUJFTF9FTlYiLCJndWxwIiwic3JjIiwicGlwZSIsImZpbGUiLCJjb250ZW50cyIsIkJ1ZmZlciIsImZyb20iLCJ0b1N0cmluZyIsInNvdXJjZUZpbGVOYW1lIiwiX19kaXJuYW1lIiwicGF0aCIsImNvZGUiLCJkZXN0IiwiZWplY3QiLCJ0ZXJtIiwicHJvbXB0IiwidHlwZSIsIm5hbWUiLCJtZXNzYWdlIiwiZGVmYXVsdCIsInRoZW4iLCJhbnN3ZXJzIiwiY29uZmlybSIsImxvZyIsImVycm9yIiwiaW5mbyIsIm12IiwiZGVsdGExIiwiZmlsZXMiLCJ0byIsInBhY2thZ2UiLCJkZXNjIiwicmVwbyIsInVybCIsImRlbHRhMiIsImRlYnVnIiwiYWRkcmVzcyIsInJlbW90ZVJvb3QiLCJkZWx0YTMiLCJsZW5ndGgiLCJFcnJvciIsImdpdGlnbm9yZSIsImluc3RhbGxUeXBlcyIsImV4ZWMiLCJybSIsImVyciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBU0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQUEsaUJBQUdDLE1BQUgsQ0FBVUMsTUFB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QUosQ0FBUyw4Q0FBVDs7QUFDQSwyQkFBSyw4VEFBTDtBQUNILEdBekRELENBMkRBLE9BQU1vQixHQUFOLEVBQVc7QUFDUHRCLHNCQUFJQyxLQUFKLENBQVcsVUFBU3FCLEdBQUcsQ0FBQ3RDLFFBQUosRUFBZSxFQUFuQztBQUNIO0FBQ0osQ0EvR21CLENBQXBCOzs7QUFpSEFNLEtBQUssQ0FBQ2pCLFdBQU4sR0FBb0IsK0RBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLy8gPyBUbyByZWdlbmVyYXRlIHRoaXMgZmlsZSAoaS5lLiBpZiB5b3UgY2hhbmdlZCBpdCBhbmQgd2FudCB5b3VyIGNoYW5nZXMgdG9cbi8vID8gYmUgcGVybWFuZW50KSwgY2FsbCBgbnBtIHJ1biByZWdlbmVyYXRlYCBhZnRlcndhcmRzXG5cbi8vICEgQmUgc3VyZSB0aGF0IHRhc2tzIGV4cGVjdGVkIHRvIHJ1biBvbiBucG0gaW5zdGFsbCAobWFya2VkIEBkZXBlbmRlbnQpIGhhdmVcbi8vICEgYWxsIHJlcXVpcmVkIHBhY2thZ2VzIGxpc3RlZCB1bmRlciBcImRlcGVuZGVuY2llc1wiIGluc3RlYWQgb2Zcbi8vICEgXCJkZXZEZXBlbmRlbmNpZXNcIiBpbiB0aGlzIHByb2plY3QncyBwYWNrYWdlLmpzb25cblxuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdmcydcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXG5pbXBvcnQgZ3VscCBmcm9tICdndWxwJ1xuaW1wb3J0IHRhcCBmcm9tICdndWxwLXRhcCdcbmltcG9ydCBkZWwgZnJvbSAnZGVsJ1xuaW1wb3J0IGxvZyBmcm9tICdmYW5jeS1sb2cnXG5pbXBvcnQgcGFyc2VHaXRJZ25vcmUgZnJvbSAncGFyc2UtZ2l0aWdub3JlJ1xuaW1wb3J0IHsgdHJhbnNmb3JtU3luYyBhcyBiYWJlbCB9IGZyb20gJ0BiYWJlbC9jb3JlJ1xuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VQYXRoLCByZWxhdGl2ZSBhcyByZWxQYXRoIH0gZnJvbSAncGF0aCdcbmltcG9ydCB0ZXJtIGZyb20gJ2lucXVpcmVyJ1xuaW1wb3J0IHJlcGxhY2VJbkZpbGUgZnJvbSAncmVwbGFjZS1pbi1maWxlJ1xuaW1wb3J0IHNoIGZyb20gJ3NoZWxsanMnXG5cbnNoLmNvbmZpZy5zaWxlbnQgPSB0cnVlO1xuc2guY29uZmlnLmZhdGFsID0gdHJ1ZTtcblxuY29uc3QgcGF0aHMgPSB7fTtcbmNvbnN0IEZMT1dfVFlQRVNfRElSID0gJ2Zsb3ctdHlwZWQnO1xuXG5wYXRocy5mbG93VHlwZWRHaXRJZ25vcmUgPSBgJHtGTE9XX1RZUEVTX0RJUn0vLmdpdGlnbm9yZWA7XG5wYXRocy5jb25maWdzID0gJ2NvbmZpZyc7XG5wYXRocy5wYWNrYWdlSnNvbiA9ICdwYWNrYWdlLmpzb24nO1xucGF0aHMubGF1bmNoSnNvbiA9ICcudnNjb2RlL2xhdW5jaC5qc29uJztcbnBhdGhzLmxhdW5jaEpzb25EaXN0ID0gJy52c2NvZGUvbGF1bmNoLmRpc3QuanNvbic7XG5wYXRocy5lbnYgPSAnLmVudic7XG5wYXRocy5lbnZEaXN0ID0gJ2Rpc3QuZW52JztcbnBhdGhzLmdpdFByb2plY3REaXIgPSAnLmdpdCc7XG5wYXRocy5naXRJZ25vcmUgPSAnLmdpdGlnbm9yZSc7XG5wYXRocy5wYWNrYWdlTG9ja0pzb24gPSAncGFja2FnZS1sb2NrLmpzb24nO1xuXG5wYXRocy5yZWdlblRhcmdldHMgPSBbXG4gICAgYCR7cGF0aHMuY29uZmlnc30vKi5qc2Bcbl07XG5cbmNvbnN0IENMSV9CQU5ORVIgPSBgLyoqXG4qICEhISBETyBOT1QgRURJVCBUSElTIEZJTEUgRElSRUNUTFkgISEhXG4qICEgVGhpcyBmaWxlIGhhcyBiZWVuIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5LiBTZWUgdGhlICouYmFiZWwuanMgdmVyc2lvbiBvZlxuKiAhIHRoaXMgZmlsZSB0byBtYWtlIHBlcm1hbmVudCBtb2RpZmljYXRpb25zIChpbiBjb25maWcvKVxuKi9cXG5cXG5gO1xuXG5jb25zdCByZWFkRmlsZUFzeW5jID0gcHJvbWlzaWZ5KHJlYWRGaWxlKTtcblxuLy8gKiBDTEVBTlRZUEVTXG5cbmNvbnN0IGNsZWFuVHlwZXMgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0cyA9IHBhcnNlR2l0SWdub3JlKGF3YWl0IHJlYWRGaWxlQXN5bmMocGF0aHMuZmxvd1R5cGVkR2l0SWdub3JlKSk7XG5cbiAgICBsb2coYERlbGV0aW9uIHRhcmdldHMgQCAke0ZMT1dfVFlQRVNfRElSfS86IFwiJHt0YXJnZXRzLmpvaW4oJ1wiIFwiJyl9XCJgKTtcbiAgICBkZWwodGFyZ2V0cywgeyBjd2Q6IEZMT1dfVFlQRVNfRElSIH0pO1xufTtcblxuY2xlYW5UeXBlcy5kZXNjcmlwdGlvbiA9IGBSZXNldHMgdGhlICR7RkxPV19UWVBFU19ESVJ9IGRpcmVjdG9yeSB0byBhIHByaXN0aW5lIHN0YXRlYDtcblxuLy8gKiBSRUdFTkVSQVRFXG5cbi8vID8gSWYgeW91IGNoYW5nZSB0aGlzIGZ1bmN0aW9uLCBydW4gYG5wbSBydW4gcmVnZW5lcmF0ZWAgdHdpY2U6IG9uY2UgdG9cbi8vID8gY29tcGlsZSB0aGlzIG5ldyBmdW5jdGlvbiBhbmQgb25jZSBhZ2FpbiB0byBjb21waWxlIGl0c2VsZiB3aXRoIHRoZSBuZXdseVxuLy8gPyBjb21waWxlZCBsb2dpYy4gSWYgdGhlcmUgaXMgYW4gZXJyb3IgdGhhdCBwcmV2ZW50cyByZWdlbmVyYXRpb24sIHlvdSBjYW5cbi8vID8gcnVuIGBucG0gcnVuIGdlbmVyYXRlYCB0aGVuIGBucG0gcnVuIHJlZ2VuZXJhdGVgIGluc3RlYWQuXG5jb25zdCByZWdlbmVyYXRlID0gKCkgPT4ge1xuICAgIGxvZyhgUmVnZW5lcmF0aW5nIHRhcmdldHM6IFwiJHtwYXRocy5yZWdlblRhcmdldHMuam9pbignXCIgXCInKX1cImApO1xuXG4gICAgcHJvY2Vzcy5lbnYuQkFCRUxfRU5WID0gJ2dlbmVyYXRvcic7XG5cbiAgICByZXR1cm4gZ3VscC5zcmMocGF0aHMucmVnZW5UYXJnZXRzKVxuICAgICAgICAgICAgICAgLnBpcGUodGFwKGZpbGUgPT4gZmlsZS5jb250ZW50cyA9IEJ1ZmZlci5mcm9tKENMSV9CQU5ORVIgKyBiYWJlbChmaWxlLmNvbnRlbnRzLnRvU3RyaW5nKCksIHtcbiAgICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlTmFtZTogcmVsUGF0aChfX2Rpcm5hbWUsIGZpbGUucGF0aClcbiAgICAgICAgICAgICAgIH0pLmNvZGUpKSlcbiAgICAgICAgICAgICAgIC5waXBlKGd1bHAuZGVzdCgnLicpKTtcbn07XG5cbnJlZ2VuZXJhdGUuZGVzY3JpcHRpb24gPSAnSW52b2tlcyBiYWJlbCBvbiB0aGUgZmlsZXMgaW4gY29uZmlnLCB0cmFuc3BpbGluZyB0aGVtIGludG8gdGhlaXIgcHJvamVjdCByb290IHZlcnNpb25zJztcblxuLy8gKiBFSkVDVFxuXG5jb25zdCBlamVjdCA9ICgpID0+IHRlcm0ucHJvbXB0KFtcbiAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICdwYWNrYWdlLm5hbWUnLFxuICAgICAgICBtZXNzYWdlOiAnW3BhY2thZ2UuanNvbl0gU3BlY2lmeSBuYW1lIGZvciB0aGlzIHByb2plY3QgKG11c3QgYmUgdmFsaWQgYXMgYSBkaXJlY3RvcnkgbmFtZSknXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICdwYWNrYWdlLmRlc2MnLFxuICAgICAgICBtZXNzYWdlOiAnW3BhY2thZ2UuanNvbl0gVmVyeSBicmllZmx5IGRlc2NyaWJlIHRoaXMgcHJvamVjdCcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICdwYWNrYWdlLnJlcG8udXJsJyxcbiAgICAgICAgbWVzc2FnZTogJ1twYWNrYWdlLmpzb25dIFNwZWNpZnkgYSBnaXQgcmVwb3NpdG9yeSBVUkwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICdkZWJ1Zy5hZGRyZXNzJyxcbiAgICAgICAgbWVzc2FnZTogJ1tsYXVuY2guanNvbl0gU3BlY2lmeSB5b3VyIGRldi9yZW1vdGUvc2VydmVyIGlwIGFkZHJlc3MgKHRoZSBvbmUgcnVubmluZyBub2RlKScsXG4gICAgICAgIGRlZmF1bHQ6ICcxOTIuMTY4LjExNS41J1xuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICBuYW1lOiAnZGVidWcudXJsJyxcbiAgICAgICAgbWVzc2FnZTogJ1tsYXVuY2guanNvbl0gU3BlY2lmeSB0aGUgVVJMIGVudHJ5IHBvaW50IGZvciB5b3VyIGFwcGxpY2F0aW9uJyxcbiAgICAgICAgZGVmYXVsdDogJ2h0dHA6Ly9kZXYubG9jYWw6ODAnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICdkZWJ1Zy5yZW1vdGVSb290JyxcbiAgICAgICAgbWVzc2FnZTogXCJbbGF1bmNoLmpzb25dIFNwZWNpZnkgYW4gKmFic29sdXRlKiBwYXRoIHRvIHRoaXMgcHJvamVjdCdzIHJvb3Qgb24gcmVtb3RlL3NlcnZlclwiXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdjb25maXJtJyxcbiAgICAgICAgbmFtZTogJ2luc3RhbGxUeXBlcycsXG4gICAgICAgIG1lc3NhZ2U6ICdEbyB5b3Ugd2FudCB0byBpbnN0YWxsIEZsb3cgdHlwZXMgZm9yIGFsbCBsb2NhbCBwYWNrYWdlcz8nLFxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdjb25maXJtJyxcbiAgICAgICAgbmFtZTogJ2NvbmZpcm0nLFxuICAgICAgICBtZXNzYWdlOiAnRG9lcyBldmVyeXRoaW5nIGxvb2sgZ29vZD8nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH1cbl0pLnRoZW4oYXN5bmMgYW5zd2VycyA9PiB7XG4gICAgaWYoIWFuc3dlcnMuY29uZmlybSlcbiAgICAgICAgcmV0dXJuIGxvZy5lcnJvcignVGFzayBhYm9ydGVkIScpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgbG9nLmluZm8oYE1vdmluZyAke3BhdGhzLmVudkRpc3R9IC0+ICR7cGF0aHMuZW52fWApO1xuICAgICAgICBzaC5tdihwYXRocy5lbnZEaXN0LCBwYXRocy5lbnYpO1xuXG4gICAgICAgIGxvZy5pbmZvKGBNb3ZpbmcgJHtwYXRocy5sYXVuY2hKc29uRGlzdH0gLT4gJHtwYXRocy5sYXVuY2hKc29ufWApO1xuICAgICAgICBzaC5tdihwYXRocy5sYXVuY2hKc29uRGlzdCwgcGF0aHMubGF1bmNoSnNvbik7XG5cbiAgICAgICAgbG9nLmluZm8oYE11dGF0aW5nICR7cGF0aHMucGFja2FnZUpzb259YCk7XG4gICAgICAgIGNvbnN0IGRlbHRhMSA9IGF3YWl0IHJlcGxhY2VJbkZpbGUoe1xuICAgICAgICAgICAgZmlsZXM6IHBhdGhzLnBhY2thZ2VKc29uLFxuICAgICAgICAgICAgZnJvbTogWy8oXCJuYW1lXCI6ID8pXCIuKj9cIi9nLCAvKFwiZGVzY3JpcHRpb25cIjogPylcIi4qP1wiL2csIC8oXCJ1cmxcIjogPylcIi4qP1wiL2ddLFxuICAgICAgICAgICAgdG86IFtgJDFcIiR7YW5zd2Vycy5wYWNrYWdlLm5hbWV9XCJgLCBgJDFcIiR7YW5zd2Vycy5wYWNrYWdlLmRlc2N9XCJgLCBgJDFcIiR7YW5zd2Vycy5wYWNrYWdlLnJlcG8udXJsfVwiYF0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxvZy5pbmZvKGBNdXRhdGluZyAke3BhdGhzLmxhdW5jaEpzb259YCk7XG4gICAgICAgIGNvbnN0IGRlbHRhMiA9IGF3YWl0IHJlcGxhY2VJbkZpbGUoe1xuICAgICAgICAgICAgZmlsZXM6IHBhdGhzLmxhdW5jaEpzb24sXG4gICAgICAgICAgICBmcm9tOiBbLyhcImFkZHJlc3NcIjogPylcIi4qP1wiL2csIC8oXCJyZW1vdGVSb290XCI6ID8pXCIuKj9cIi9nLCAvKFwidXJsXCI6ID8pXCIuKj9cIi9nXSxcbiAgICAgICAgICAgIHRvOiBbYCQxXCIke2Fuc3dlcnMuZGVidWcuYWRkcmVzc31cImAsIGAkMVwiJHthbnN3ZXJzLmRlYnVnLnJlbW90ZVJvb3R9XCJgLCBgJDFcIiR7YW5zd2Vycy5kZWJ1Zy51cmx9XCJgXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbG9nLmluZm8oYE11dGF0aW5nICR7cGF0aHMuZ2l0SWdub3JlfWApO1xuICAgICAgICBjb25zdCBkZWx0YTMgPSBhd2FpdCByZXBsYWNlSW5GaWxlKHtcbiAgICAgICAgICAgIGZpbGVzOiBwYXRocy5naXRJZ25vcmUsXG4gICAgICAgICAgICBmcm9tOiAncGFja2FnZS1sb2NrLmpzb24nLFxuICAgICAgICAgICAgdG86ICcnLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZighZGVsdGExLmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgd2FzIGFuIGVycm9yIGF0dGVtcHRpbmcgdG8gYWNjZXNzIFwiJHtwYXRocy5wYWNrYWdlSnNvbn1cImApO1xuXG4gICAgICAgIGlmKCFkZWx0YTIubGVuZ3RoKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSB3YXMgYW4gZXJyb3IgYXR0ZW1wdGluZyB0byBhY2Nlc3MgXCIke3BhdGhzLmxhdW5jaEpzb259XCJgKTtcblxuICAgICAgICBpZighZGVsdGEzLmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgd2FzIGFuIGVycm9yIGF0dGVtcHRpbmcgdG8gYWNjZXNzIFwiJHtwYXRocy5naXRpZ25vcmV9XCJgKTtcblxuICAgICAgICBpZihhbnN3ZXJzLmluc3RhbGxUeXBlcylcbiAgICAgICAge1xuICAgICAgICAgICAgbG9nLmluZm8oYEluc3RhbGxpbmcgZmxvdyB0eXBlcyAocGxlYXNlIGJlIHBhdGllbnQpYCk7XG4gICAgICAgICAgICBzaC5leGVjKCducG0gcnVuIGluc3RhbGwtdHlwZXMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZy5pbmZvKGBSZW1vdmluZyAke3BhdGhzLnBhY2thZ2VMb2NrSnNvbn1gKTtcbiAgICAgICAgc2gucm0oJy1mJywgcGF0aHMucGFja2FnZUxvY2tKc29uKTtcblxuICAgICAgICBsb2cuaW5mbygnUmVtb3ZpbmcgYm9pbGVycGxhdGUgZ2l0IHJlcG9zaXRvcnknKTtcbiAgICAgICAgc2gucm0oJy1yZicsICcuZ2l0Jyk7XG5cbiAgICAgICAgbG9nLmluZm8oJ0luaXRpYWxpemluZyBuZXcgZ2l0IHJlcG9zaXRvcnknKTtcbiAgICAgICAgc2guZXhlYygnZ2l0IGluaXQnKTtcblxuICAgICAgICBsb2cuaW5mbyhgUmVuYW1pbmcgcHJvamVjdCBkaXIgdG8gJHthbnN3ZXJzLnBhY2thZ2UubmFtZX1gKTtcbiAgICAgICAgc2guZXhlYyhgY2QgLi4gJiYgbXYgJyR7cGFyc2VQYXRoKF9fZGlybmFtZSkubmFtZX0nICcke2Fuc3dlcnMucGFja2FnZS5uYW1lfSdgKTtcblxuICAgICAgICBsb2cuaW5mbygnQm9pbGVycGxhdGUgZWplY3Rpb24gY29tcGxldGVkIHN1Y2Nlc3NmdWxseSEnKTtcbiAgICAgICAgbG9nKGBOZXh0IHN0ZXBzOlxcblxcdC0gSWYgeW91J3JlIGdvaW5nIHRvIGhvc3QgdGhpcyBwcm9qZWN0IG9uIEdpdGh1Yi9HaXRsYWIsIGJlZ2luIHRoYXQgcHJvY2VzcyBub3dcXG5cXHQtIENoZWNrIG92ZXIgcGFja2FnZS5qc29uIGZvciBhY2N1cmFjeTsgcmVtb3ZlIGFueSB1bm5lY2Vzc2FyeSBkZXBlbmRlbmNpZXMvZGV2RGVwZW5kZW5jaWVzXFxuXFx0LSBDaGVjayBvdmVyIHlvdXIgdnNjb2RlIGxhdW5jaCBjb25maWd1cmF0aW9uIGlmIHlvdSBwbGFuIG9uIHVzaW5nIGl0XFxuXFx0LSBMb29rIG92ZXIgLmVudiBhbmQgY29uZmlndXJlIGl0IHRvIHlvdXIgbGlraW5nXFxuYCk7XG4gICAgfVxuXG4gICAgY2F0Y2goZXJyKSB7XG4gICAgICAgIGxvZy5lcnJvcihgRVJST1I6ICR7ZXJyLnRvU3RyaW5nKCl9YCk7XG4gICAgfVxufSk7XG5cbmVqZWN0LmRlc2NyaXB0aW9uID0gJ0Fzc2lzdHMgaW4gY29uZmlndXJpbmcgdGhlIGJvaWxlcnBsYXRlIHRvIGJlIHNvbWV0aGluZyB1c2VmdWwnO1xuXG5leHBvcnQgeyBlamVjdCwgcmVnZW5lcmF0ZSwgY2xlYW5UeXBlcyB9O1xuIl19