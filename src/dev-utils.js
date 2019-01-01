/* @flow */

// * Due to this file being imported directly in node, Node-compliant ES6 must
// * be used, and node doesn't support import statements. Once Node catches up
// * with the times, all dirty ES5 artifacts like require() should be replaced
// * their superior language features

const pkg = require('../package.json');
const dotenv = require('dotenv');

const expectedEnvVariables = pkg.expectedEnvVariables || [];

if(!Array.isArray(expectedEnvVariables))
    throw new Error('expectedEnvVariables in package.json must be an array');

const throwEnvError = variable => {
    throw new Error(`${variable} is improperly defined. Did you copy dist.env -> .env ?`);
};

module.exports = {
    populateEnv() {
        const conf = dotenv.config();

        // ? Parse the .env file at the project root or throw an error if it does
        // ? not exist or if parsing fails for some other reason
        if(!conf || !conf.parsed)
            throw new Error('Failed to parse an .env configuration. Did you copy dist.env -> .env ?');

        // ? Loop over the values in expectedEnvVariables from package.json to
        // ? ensure they exist and are strings. If this is not the case, throw an
        // ? error. There are two loops here to allow for "or syntax," i.e.
        // ? var1|var2|var3 (see README)
        expectedEnvVariables.forEach(variable =>
            variable.split('|').every(subvar => typeof process.env[subvar] !== 'string') && throwEnvError(variable)
        );

        // ? Resolve the true node/application environment mode --> APP_ENV
        // ? Recognized values: development, test, production
        process.env.APP_ENV = process.env.NODE_ENV || process.env.BABEL_ENV || process.env.APP_ENV || 'unknown';
        process.env.APP_ENV == 'unknown' && console.warn('WARNING: the application environment resolved to "unknown"!');
    }
};
