import changed from 'gulp-changed';
import csscomb from 'gulp-csscomb';
import gulpif from 'gulp-if';
import minify from 'gulp-clean-css';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import source from 'gulp-sourcemaps';
import { dest, src } from 'gulp';
import tap from "gulp-tap";

/**
 *
 * @param {Config} cfg
 * @param {Object} browserSync
 * @returns {*}
 */
export function build(cfg, browserSync) {
	const destDir = `${cfg.dest.base}/${cfg.dest.css}`;

	// !!cfg.env - env = undefined - false
	// !!!cfg.env - env = undefined - true
	// !!cfg.env - env = any - true
	// !!!cfg.env - env = any - false

	return src(`${cfg.src.base}/${cfg.src.bundles}/**/*.scss`)
		.pipe(gulpif(!!!cfg.env, changed(destDir)))
		.pipe(gulpif(cfg.env === 'debug', source.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(csscomb({configPath: '.csscomb.json'}))
		.pipe(gulpif(!!cfg.env, minify({debug: true})))
		.pipe(gulpif(!!cfg.env, rename({extname: '.min.css'})))
		.pipe(gulpif(cfg.env === 'debug', source.write()))
		.pipe(dest(destDir))
		.pipe(gulpif(!!browserSync, browserSync.stream()));
}
