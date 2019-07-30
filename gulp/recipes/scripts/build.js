import browserify from 'browserify';
import buffer from 'gulp-buffer'
import changed from 'gulp-changed';
import gulpif from 'gulp-if';
import rename from "gulp-rename";
import sourcemaps from 'gulp-sourcemaps'
import tap from 'gulp-tap'
import uglify from 'gulp-uglify';
import { src, dest } from 'gulp';

/**
 *
 * @param {Config} cfg
 * @param {Function} reload
 * @returns {*}
 */
export function build(cfg, reload) {
    const destDir = `${cfg.dest.base}/${cfg.dest.js}`;

    // !!cfg.env - env = undefined - false
    // !!!cfg.env - env = undefined - true
    // !!cfg.env - env = any - true
    // !!!cfg.env - env = any - false

    return src(`${cfg.src.base}/${cfg.src.bundles}/**/*.js`, {read: false})
        // .pipe(gulpif(!!!cfg.env, changed(destDir)))
        .pipe(tap(function (file) {
            file.contents = browserify(file.path).transform('babelify', {presets: ['@babel/preset-env']}).bundle();

        }))
        .pipe(buffer())
        .pipe(gulpif(cfg.env === 'debug', sourcemaps.init()))
        .pipe(gulpif(!!cfg.env, uglify()))
        .pipe(gulpif(!!cfg.env, rename({extname: '.min.js'})))
        .pipe(gulpif(cfg.env === 'debug', sourcemaps.write()))
        .pipe(dest(destDir))
        .on('finish', () => reload ? reload() : null );
}
