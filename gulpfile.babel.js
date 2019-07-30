import * as configJSON from './config';
import BrowserSync from 'browser-sync';
import merge from 'merge-stream';
import minimist from 'minimist';
import { build as buildHTML} from './gulp/recipes/html';
import { build as buildJS} from './gulp/recipes/scripts';
import { build as buildSCSS, minifyCssNames} from './gulp/recipes/styles';
import { bundle } from './gulp/recipes/bundle';
import { task, series, watch, parallel } from 'gulp';

const browserSync = BrowserSync.create();

const knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV
    }
};

for(let key in configJSON.default) {
    knownOptions.default[key] = configJSON.default[key];
}

const config = minimist(process.argv.slice(2), knownOptions);

const version = new Date().getTime();

config.gih = {
    version,
    min: config.env === "production" ? '.min' : '',

    baseDir: './html/modules/',
    ignore: '\/modules\/'
};

task('bundle', series(() => merge(bundle(config))));

/**
 * CSS distribution
 */
task('styles:build', series(() => merge(buildSCSS(config, browserSync))));

task('styles:minify-css-names', series(() => merge(minifyCssNames(config))));

task('styles:dist', series(['bundle', 'styles:build']));


/**
 * JS distribution
 */
task('scripts:build', series(() => merge(buildJS(config))));

task('scripts:dist', series(['bundle', 'scripts:build']));


/**
 * HTML distribution
 */
task('html:build', series(() => merge(buildHTML(config))));


/**
 * All distribution
 */

task('serve', function(done) {
    function reload() {
        browserSync.reload();
        done();
    }

    browserSync.init({
        server: config.dest.base,
        open: false
    });

    watch(['./src/templates/**/*.html'], series(['bundle', () => merge(buildHTML(config, reload))]));
    watch(['./src/bundles/**/*.scss', './src/blocks/**/*.scss', './src/blocks/**/*.json'], series(['styles:build']));
    watch(['./src/bundles/**/*.js', './src/blocks/**/*.js', './src/blocks/**/*.json'], series([() => merge(buildJS(config, reload))]));
});

task('dist', parallel(['bundle', 'html:build', parallel(['styles:build', 'scripts:build'])]));

/**
 * @typedef ConfigSrc
 * @type {object}
 * @property {string} base - base path
 * @property {string} js - js path
 * @property {string} css - css path
 * @property {string} html - html path
 * @property {string} bundles - bundles path
 * @property {string} blocks - blocks path
 */

/**
 * @typedef ConfigDest
 * @type {object}
 * @property {string} base - base path
 * @property {string} js - js path
 * @property {string} css - css path
 */

/**
 * @typedef ConfigGih
 * @type {object}
 * @property {number} version - version
 * @property {string} min - is minified files
 * @property {string} baseDir - base dir
 * @property {string} ignore - ignore dir/files
 */

/**
 * @typedef Config
 * @type {object}
 * @property {ConfigDest} dest
 * @property {ConfigSrc} src
 * @property {string} gulpfile
 * @property {ConfigGih} gih
 * @property {string} env
 * @property {boolean} force
 */
