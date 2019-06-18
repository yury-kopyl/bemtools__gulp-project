import * as configJSON from './config';
import merge from 'merge-stream';
import minimist from 'minimist';
import { build as buildJS, bundle as bundleJS} from './gulp/recipes/scripts';
import { build as buildSCSS, bundle as bundleSCSS} from './gulp/recipes/styles';
import { task, series, watch } from 'gulp';

const knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};

for(let key in configJSON.default) {
    knownOptions.default[key] = configJSON.default[key];
}

const config = minimist(process.argv.slice(2), knownOptions);

/**
 * CSS distribution
 */
task('styles:bundle', series(() => merge(bundleSCSS(config))));

task('styles:build', series(() => merge(buildSCSS(config))));

task('styles:dist', series(['styles:bundle', 'styles:build']));


/**
 * JS distribution
 */
task('scripts:bundle', series(() => merge(bundleJS(config))));

task('scripts:build', series(() => merge(buildJS(config))));

task('scripts:dist', series(['scripts:bundle', 'scripts:build']));


/**
 * All distribution
 */
task('watch', series(() => {
    watch(['./src/html/**/*.html'], series(['styles:bundle', 'scripts:bundle']));
    watch(['./src/blocks/**/*.scss', './src/blocks/**/*.json'], series(['styles:build']));
    watch(['./src/bundles/**/*.js'], series(['scripts:build']));
}));

task('dist', series(['styles:dist', 'scripts:dist']));

/**
 * @typedef ConfigSrc
 * @type {object}
 * @property {string} base - base path
 * @property {string} js - js path
 * @property {string} css - css path
 * @property {string} html - html path
 * @property {string} bundles - bundles path
 */

/**
 * @typedef ConfigDest
 * @type {object}
 * @property {string} dev - base path
 * @property {string} prod - base path
 * @property {string} js - js path
 * @property {string} css - css path
 */

/**
 * @typedef Config
 * @type {object}
 * @property {ConfigDest} dest
 * @property {ConfigSrc} src
 * @property {string} gulpfile
 * @property {string} env
 */
