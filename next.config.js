function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { readdirSync, lstatSync } from 'fs';
import path from 'path';
var ANALYZE_WEBPACK_BUNDLES = process.env.ANALYZE_WEBPACK_BUNDLES;
var paths = {
  components: "".concat(__dirname, "/components")
};

module.exports = function (phase, _ref) {
  var defaultConfig = _ref.defaultConfig;
  // eslint-disable-line no-unused-vars
  return {
    webpack: function webpack(config, _ref2) {
      var isServer = _ref2.isServer;

      if (ANALYZE_WEBPACK_BUNDLES) {
        config.plugins.push(new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true
        }));
      } // config.entry = './src/index.js';
      // config.output = {
      //     path: __dirname + '/dist',
      //     publicPath: '/',
      //     filename: 'bundle.js'
      // };
      // config.devServer = {
      //     contentBase: './dist'
      // };
      // config.module.rules.push({
      //     test: /\.js$/,
      //     exclude: /node_modules/,
      //     use: {
      //         loader: 'babel-loader'
      //     }
      // });


      readdirSync(paths.components).map(function (dir) {
        return [path.resolve(paths.components, dir), dir];
      }).filter(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            dirpath = _ref4[0];

        return lstatSync(dirpath).isDirectory();
      }).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            dirpath = _ref6[0],
            dirname = _ref6[1];

        return config.resolve.alias[dirname] = dirpath;
      });
      return config;
    },
    // ? Will only be available on the server side
    serverRuntimeConfig: {// ...
    },
    // ? Will be available on both server and client
    publicRuntimeConfig: {// ...
    }
  };
};