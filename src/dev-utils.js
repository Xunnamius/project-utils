/* @flow */

import pkg from '../package.json'
import dotenv from 'dotenv';

const expectedEnvVariables = pkg.expectedEnvVariables || [];

if(!Array.isArray(expectedEnvVariables))
    throw new Error('expectedEnvVariables in package.json must be an array');

const throwEnvError = variable => {
    throw new Error(`${variable} is improperly defined. Did you copy dist.env -> .env ?`);
};

export const populateEnv = () => {
    if(!dotenv.config()?.parsed)
        throw new Error('Failed to parse an .env configuration. Did you copy dist.env -> .env ?');

    expectedEnvVariables.forEach(variable => typeof process.env[variable] !== 'string' && throwEnvError(variable));
};
