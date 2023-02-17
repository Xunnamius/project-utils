import { name as pkgName } from 'package';
import { debugFactory } from 'multiverse/debug-extended';

// ! BEWARE: this is the ONLY relative import that is externalized by default
// ! (for code deduplication). Centralize local exports into ./src/index.ts or
// ! manually configure Webpack to output additional bundles under
// ! ./dist/cjs-static; otherwise, local imports from ./dist/cli.js will fail.
// ! This protects against any potential dual package hazards!
import { configureProgram, CliError, LinterError } from './index';

const debug = debugFactory(`${pkgName}:cli`);

export default (({ program, parse }) =>
  parse().catch(async (error: Error | string) => {
    if (!(error instanceof LinterError) && !(await program.argv).silent) {
      // eslint-disable-next-line no-console
      console.error(
        `fatal: ${(typeof error == 'string' ? error : error.message).replace(
          /^fatal: /,
          ''
        )}`
      );
    }

    debug('%O', error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(error instanceof CliError ? error.exitCode : 1);
  }))(configureProgram());
