import { name as pkgName } from 'package';
import debugFactory from 'debug';
import 'jest-extended';

const debug = debugFactory(`${pkgName}:jest-setup`);

debug(`pkgName: "${pkgName}"`);
debug(`pkgVersion: "N/A"`);
