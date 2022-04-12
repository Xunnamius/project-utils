/* eslint-disable no-console */
import yargs from 'yargs/yargs';
import { debugFactory } from 'multiverse/debug-extended';
import { LinterError } from './errors';
import { defaultMarkdownGlob } from './constants';

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
    .strict()
    .string('_')
    .options({
      silent: {
        describe: 'Nothing will be printed to stdout or stderr',
        type: 'boolean',
        default: false
      },
      'root-dir': {
        describe:
          'The project root directory containing ESLint and TypeScript ' +
          'configuration files, and that relative paths and globs are ' +
          'resolved against. This must be an absolute path.',
        type: 'string',
        default: process.cwd(),
        defaultDescription: 'process.cwd()'
      },
      'src-path': {
        describe:
          'Absolute or relative paths that resolve to one or more directories ' +
          'containing source files, or to one or more source files themselves.',
        type: 'array',
        default: ['./src']
      },
      'md-path': {
        describe:
          'Absolute paths, relative paths, and/or globs that resolve to one ' +
          'or more markdown files. If a single argument ending in "/" is given, the default glob pattern will be appended to this argument instead.',
        type: 'array',
        default: [defaultMarkdownGlob],
        defaultDescription: '.md files not under node_modules'
      },
      project: {
        describe:
          'An absolute or relative path to, or file name of a TypeScript tsconfig.json configuration file.',
        type: 'string',
        default: 'tsconfig.lint.json'
      },
      'pre-push-only': {
        describe:
          'In pre-push mode, a limited subset of checks are performed. Pre-push linting mode is meant to be invoked by the "pre-push" Git hook.',
        type: 'boolean',
        default: false,
        conflicts: 'link-protection-only'
      },
      'link-protection-only': {
        describe:
          'In link protection mode, a limited subset of checks are performed. Link protection linting mode is meant to be invoked after potentially-destructive operations on Markdown files (e.g. via Remark) to check for links that have been accidentally disabled.',
        type: 'boolean',
        default: false,
        conflicts: 'pre-push-only'
      }
    });

  return {
    program: finalProgram,
    parse: async (argv?: readonly string[]) => {
      argv = argv?.length ? argv : process.argv.slice(2);
      debug('saw argv: %O', argv);

      const finalArgv = await finalProgram.parse(argv);
      const silent = finalArgv.silent as boolean;
      const tsconfig = finalArgv.project as string;
      const rootDir = finalArgv.rootDir as string;
      const sourcePaths = finalArgv.srcPath as string[];
      const markdownPaths = finalArgv.mdPath as string[];
      const mode: NonNullable<Parameters<typeof runProjectLinter>[0]['mode']> =
        finalArgv.prePushOnly
          ? 'pre-push'
          : finalArgv.linkProtectionOnly
          ? 'link-protection'
          : 'complete';

      debug('finalArgv.silent: %O', silent);
      debug('finalArgv.tsconfig: %O', tsconfig);
      debug('finalArgv.rootDir: %O', rootDir);
      debug('finalArgv.sourcePaths: %O', sourcePaths);

      if (markdownPaths.length == 1 && markdownPaths[0].endsWith('/')) {
        markdownPaths[0] += defaultMarkdownGlob;
      }

      debug('finalArgv.markdownPaths: %O', markdownPaths);
      debug('finalArgv.mode: %O', mode);

      const results = await Promise.all([
        runProjectLinter({ rootDir, linkProtectionMarkdownPaths: markdownPaths, mode }),
        runTypescriptLinter({ rootDir, tsconfig }),
        runEslintLinter({ rootDir, sourcePaths, tsconfig }),
        runRemarkLinter({ rootDir, markdownPaths })
      ]);

      if (!silent) {
        let firstToOutput = true;
        let outputBuffer = '';

        const outputSeparator = () => {
          outputBuffer += `${!firstToOutput ? '\n---\n' : ''}\n`;
          firstToOutput = false;
        };

        if (results[3].output) {
          outputSeparator();
          outputBuffer += `:Remark:\n\n${results[3].output}\n`;
        }

        if (results[1].output) {
          outputSeparator();
          outputBuffer += `:TypeScript:\n\n${results[1].output}\n`;
        }

        if (results[2].output) {
          outputSeparator();
          outputBuffer += `:ESLint:\n\n${results[2].output}\n`;
        }

        if (results[0].output) {
          outputSeparator();
          outputBuffer += `:Project:\n\n${results[0].output}\n`;
        }

        outputBuffer += `${firstToOutput ? '' : '\n\n'}:: Linting results ::\n`;

        outputBuffer += `Remark:     ${results[3].success ? '✅' : '❌'} (${
          results[3].summary
        })\n`;

        outputBuffer += `TypeScript: ${results[1].success ? '✅' : '❌'} (${
          results[1].summary
        })\n`;

        outputBuffer += `ESLint:     ${results[2].success ? '✅' : '❌'} (${
          results[2].summary
        })\n`;

        outputBuffer += `Project:    ${results[0].success ? '✅' : '❌'} (${
          results[0].summary
        })\n`;

        process.stdout.write(outputBuffer.replace(/\n\n\n+/g, '\n\n'));
      }

      if (results.some(({ success }) => !success)) {
        throw new LinterError();
      }

      return finalArgv;
    }
  };
}
