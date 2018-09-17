/* @flow */

// ? To regenerate this file (i.e. if you changed it and want your changes to
// ? be permanent), call `npm run regenerate` afterwards

// ! Be sure that tasks expected to run on npm install (marked @dependent) have
// ! all required packages listed under "dependencies" instead of
// ! "devDependencies" in this project's package.json

import { readFile } from 'fs'
import { promisify } from 'util'
import gulp from 'gulp'
import tap from 'gulp-tap'
import del from 'del'
import log from 'fancy-log'
import parseGitIgnore from 'parse-gitignore'
import { transformSync as babel } from '@babel/core'
import { parse as parsePath, relative as relPath } from 'path'
import term from 'inquirer'
import replaceInFile from 'replace-in-file'
import sh from 'shelljs'

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

paths.regenTargets = [
    `${paths.configs}/*.js`
];

const CLI_BANNER = `/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the *.babel.js version of
* ! this file to make permanent modifications (in config/)
*/\n\n`;

const readFileAsync = promisify(readFile);

// * CLEANTYPES

const cleanTypes = async () => {
    const targets = parseGitIgnore(await readFileAsync(paths.flowTypedGitIgnore));

    log(`Deletion targets @ ${FLOW_TYPES_DIR}/: "${targets.join('" "')}"`);
    del(targets, { cwd: FLOW_TYPES_DIR });
};

cleanTypes.description = `Resets the ${FLOW_TYPES_DIR} directory to a pristine state`;

// * REGENERATE

// ? If you change this function, run `npm run regenerate` twice: once to
// ? compile this new function and once again to compile itself with the newly
// ? compiled logic. If there is an error that prevents regeneration, you can
// ? run `npm run generate` then `npm run regenerate` instead.
const regenerate = () => {
    log(`Regenerating targets: "${paths.regenTargets.join('" "')}"`);

    process.env.BABEL_ENV = 'generator';

    return gulp.src(paths.regenTargets)
               .pipe(tap(file => file.contents = Buffer.from(CLI_BANNER + babel(file.contents.toString(), {
                   sourceFileName: relPath(__dirname, file.path)
               }).code)))
               .pipe(gulp.dest('.'));
};

regenerate.description = 'Invokes babel on the files in config, transpiling them into their project root versions';

// * EJECT

const eject = () => term.prompt([
    {
        type: 'input',
        name: 'package.name',
        message: '[package.json] Specify name for this project (must be valid as a directory name)'
    },
    {
        type: 'input',
        name: 'package.desc',
        message: '[package.json] Very briefly describe this project',
    },
    {
        type: 'input',
        name: 'package.repo.url',
        message: '[package.json] Specify a git repository URL'
    },
    {
        type: 'input',
        name: 'debug.address',
        message: '[launch.json] Specify your dev/remote/server ip address (the one running node)',
        default: '192.168.115.5'
    },
    {
        type: 'input',
        name: 'debug.url',
        message: '[launch.json] Specify the URL entry point for your application',
        default: 'http://dev.local:80'
    },
    {
        type: 'input',
        name: 'debug.remoteRoot',
        message: "[launch.json] Specify an *absolute* path to this project's root on remote/server"
    },
    {
        type: 'confirm',
        name: 'installTypes',
        message: 'Do you want to install Flow types for all local packages?',
        default: true
    },
    {
        type: 'confirm',
        name: 'confirm',
        message: 'Does everything look good?',
        default: false
    }
]).then(answers => {
    if(!answers.confirm)
        return log.error('Task aborted!');

    try {
        sh.mv(paths.envDist, paths.env);
        sh.mv(paths.launchJsonDist, paths.launchJson);

        const delta1 = replaceInFile({
            files: paths.packageJson,
            from: [/("name": ?)".*?"/g, /"(description": ?)".*?"/g, /("url": ?)".*?"/g],
            to: [`$1"${answers.package.name}"`, `$1"${answers.package.desc}"`, `$1"${answers.package.repo.url}"`],
        });

        const delta2 = replaceInFile({
            files: paths.launchJson,
            from: [/("address": ?)".*?"/g, /("remoteRoot": ?)".*?"/g, /("url": ?)".*?"/g],
            to: [`$1"${answers.debug.address}"`, `$1"${answers.debug.remoteRoot}"`, `$1"${answers.debug.url}"`],
        });

        const delta3 = replaceInFile({
            files: paths.gitIgnore,
            from: 'package-lock.json',
            to: '',
        });

        if(!delta1.length)
            throw new Error(`There was an error attempting to access "${paths.packageJson}"`);

        if(!delta2.length)
            throw new Error(`There was an error attempting to access "${paths.launchJson}"`);

        if(!delta3.length)
            throw new Error(`There was an error attempting to access "${paths.gitignore}"`);

        if(answers.installTypes)
            sh('npm run install-types');

        sh.rm('-f', paths.packageLockJson);
        // sh.rm('-f', '.git');
        sh.echo("sh.rm('-f', '.git');");
        // sh('git init');
        sh.echo("sh('git init');");

        sh(`cd .. && mv '${parsePath(__dirname).name}' '${answers.package.name}'`);

        log.info('Boilerplate ejection complete!');
        log(`Next steps:\n\t- If you're going to host this project on Github/Gitlab, begin that process now\n\t- Check over package.json for accuracy; remove any unnecessary dependencies/devDependencies\n\t- Look over .env and configure it to your liking\n`);
    }

    catch(err) {
        log.error(`ERROR: ${err.toString()}`);
    }
});

eject.description = 'Assists in configuring the boilerplate to be something useful';

export { eject, regenerate, cleanTypes };
