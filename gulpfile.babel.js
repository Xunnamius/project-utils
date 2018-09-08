import gulp from 'gulp';
import log from 'fancy-log';
import replace from 'gulp-replace';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

const paths = {
    pkgjson: `${__dirname}/package.json`,
};

const print = ({ out, err }) => {
    if(out) log('stdout:', out);
    if(err) log('stderr:', err);
};

// export const example = async () => { // eslint-disable-line camelcase
//     await gulp.src([paths.pkgjson]). ...
//     log('Delete the old package.json...');
//     print(await execAsync(`rm ${paths.nextpkgjson}`));
// };
