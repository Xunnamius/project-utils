/* eslint-disable no-console */
import yargs from 'yargs/yargs';
import { debugFactory } from 'multiverse/debug-extended';
import { LinterError } from './errors';

import {
  runEslintLinter,
  runProjectLinter,
  runRemarkLinter,
  runTypescriptLinter
} from './linters';

import type { Arguments, Argv } from 'yargs';

export type Program = Argv;
export type { Arguments };
export type Parser = (argv?: string[]) => Promise<Arguments>;

export type Context = {
  program: Program;
  parse: Parser;
};

const debug = debugFactory(`plugin-lint:parse`);

export * from './errors';

/**
 * Create and return a pre-configured Yargs instance (program) and argv parser.
 */
export function configureProgram(): Context;
/**
 * Configure an existing Yargs instance (program) and return an argv parser.
 *
 * @param program A Yargs instance to configure
 */
export function configureProgram(program: Program): Context;
export function configureProgram(program?: Program): Context {
  const finalProgram = program || yargs();

  finalProgram
    .scriptName('plugin-lint')
    .usage('$0\n\nCheck a project for correctness.')
    .strictOptions()
    .string('_')
    .options({
      silent: {
        describe: 'Nothing will be printed to stdout or stderr',
        type: 'boolean',
        default: false
      },
      rootDir: {
        describe:
          'The project root directory containing ESLint and TypeScript ' +
          'configuration files, and that relative paths and globs are ' +
          'resolved against.',
        type: 'string',
        default: process.cwd(),
        defaultDescription: 'process.cwd()'
      },
      srcPath: {
        describe:
          'Absolute or relative paths that resolve to one or more directories ' +
          'containing source files, or to one or more source files themselves.',
        type: 'array',
        default: ['./src']
      },
      mdPath: {
        describe:
          'Absolute paths, relative paths, and/or globs that resolve to one ' +
          'or more markdown files.',
        type: 'array',
        default: ['{{,.}*.md,!(node_modules)/**/{,.}*.md,.*/**/{,.}*.md}'],
        defaultDescription: 'all files ending in .md not under node_modules'
      },
      project: {
        describe:
          'An absolute or relative path to a TypeScript tsconfig.json configuration file.',
        type: 'string',
        default: 'tsconfig.lint.json'
      },
      'pre-push-only': {
        describe:
          'In pre-push mode, a limited subset of checks are performed. Pre-push linting mode is meant to be invoked by the "pre-push" Git hook.',
        type: 'boolean',
        default: false
      }
    });

  return {
    program: finalProgram,
    parse: async (argv?: string[]) => {
      argv = argv?.length ? argv : process.argv.slice(2);
      debug('saw argv: %O', argv);

      const finalArgv = await finalProgram.parse(argv);
      const silent = finalArgv.silent as boolean;
      const tsconfig = finalArgv.project as string;
      const rootDir = finalArgv.rootDir as string;
      const sourcePaths = finalArgv.srcPath as string[];
      const markdownPaths = finalArgv.mdPath as string[];

      const results = await Promise.all([
        runProjectLinter({ rootDir }),
        runTypescriptLinter({ rootDir, tsconfig }),
        runEslintLinter({ rootDir, sourcePaths, tsconfig }),
        runRemarkLinter({ rootDir, markdownPaths })
      ]);

      if (!silent) {
        // TODO: output path of each package (especially when recursively linting)
        // TODO: add "pre-push" mode and corresponding husky hook

        let firstToOutput = true;
        const outputSeparator = () => {
          console.log(`${!firstToOutput ? '\n---\n' : ''}`);
          firstToOutput = false;
        };

        if (results[3].output) {
          outputSeparator();
          console.log(`:Remark:\n\n${results[3].output}`);
        }

        if (results[1].output) {
          outputSeparator();
          process.stdout.write(`:TypeScript:\n\n${results[1].output}`);
        }

        if (results[2].output) {
          outputSeparator();
          process.stdout.write(`:ESLint:\n${results[2].output}`);
        }

        if (results[0].output) {
          outputSeparator();
          console.log(`:Project:\n\n${results[0].output}`);
        }

        console.log(`${firstToOutput ? '' : '\n'}:: Linting results ::`);

        console.log(
          `Remark: ${results[3].success ? '✅' : '❌'} (${results[3].summary})`
        );

        console.log(
          `TypeScript: ${results[1].success ? '✅' : '❌'} (${results[1].summary})`
        );

        console.log(
          `ESLint: ${results[2].success ? '✅' : '❌'} (${results[2].summary})`
        );

        console.log(
          `Project: ${results[0].success ? '✅' : '❌'} (${results[0].summary})`
        );
      }

      if (results.some(({ success }) => !success)) {
        throw new LinterError();
      }

      return finalArgv;
    }
  };
}
