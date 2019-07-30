import changed from 'gulp-changed';
import csscomb from 'gulp-csscomb';
import gulpif from 'gulp-if';
import minify from 'gulp-clean-css';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import { dest, src } from 'gulp';
import gulpMinifyCssNames from 'gulp-minify-cssnames';

/**
 *
 * @param {Config} cfg
 * @returns {*}
 */
export function minifyCssNames(cfg) {
    const destDir = `${cfg.dest.base}`;

    return src([`${cfg.dest.base}/css/tooltip.css`, `${cfg.dest.base}/tooltip.html`, `${cfg.dest.base}/js/tooltip.js`])
        // .pipe(gulpif(cfg.env !== 'production', changed(destDir)))
        .pipe(gulpMinifyCssNames({postfix: ''}))
        .pipe(dest(destDir));
}
