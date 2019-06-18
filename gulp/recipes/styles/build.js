import changed from 'gulp-changed';
import csscomb from 'gulp-csscomb';
import gulpif from 'gulp-if';
import minify from 'gulp-clean-css';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import { dest, src } from 'gulp';

/**
 *
 * @param {Config} cfg
 * @returns {*}
 */
export function build(cfg) {
	const destDir = `${cfg.env === 'production' ? cfg.dest.prod : cfg.dest.dev}/${cfg.dest.css}`;

	return src(`${cfg.src.base}/${cfg.src.bundles}/**/*.scss`)
		.pipe(gulpif(cfg.env !== 'production', changed(destDir)))
		.pipe(sass().on('error', sass.logError))
		.pipe(csscomb({configPath: '.csscomb.json'}))
		.pipe(gulpif(cfg.env === 'production', minify({debug: true})))
		.pipe(gulpif(cfg.env === 'production', rename({extname: '.min.css'})))
		.pipe(dest(destDir));
}
