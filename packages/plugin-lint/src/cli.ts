import { name as pkgName } from 'package';
import { configureProgram } from './index';
import { debugFactory } from 'multiverse/debug-extended';
import { CliError, LinterError } from './error';

const debug = debugFactory(`${pkgName}:cli`);

export default (({ program, parse }) =>
  parse().catch(async (e: Error | string) => {
    if (!(e instanceof LinterError) && !(await program.argv).silent) {
      // eslint-disable-next-line no-console
      console.error(
        `fatal: ${(typeof e == 'string' ? e : e.message).replace(/^fatal: /, '')}`
      );
    }

    debug('%O', e);
    process.exit(e instanceof CliError ? e.exitCode : 1);
  }))(configureProgram());
