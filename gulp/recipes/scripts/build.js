import babel from 'gulp-babel';
import changed from 'gulp-changed';
import gulpif from 'gulp-if';
import uglify from 'gulp-uglify';
import { src, dest } from 'gulp';

/**
 *
 * @param {Config} cfg
 * @returns {*}
 */
export function build(cfg) {
    const destDir = `${cfg.env === 'production' ? cfg.dest.prod : cfg.dest.dev}/${cfg.dest.js}`;

    return src(`${cfg.src.base}/${cfg.src.bundles}/**/*.js`)
        .pipe(gulpif(cfg.env !== 'production', changed(destDir)))
        .pipe(babel())
        .pipe(gulpif(cfg.env === 'production', uglify()))
        .pipe(dest(destDir));
}
