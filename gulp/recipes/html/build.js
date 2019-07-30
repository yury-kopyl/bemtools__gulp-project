import gih from 'gulp-include-html';
import gulpif from 'gulp-if';
import htmlmin from 'gulp-htmlmin';
import { dest, src } from 'gulp';
import extractClass from "@bemtools/gulp-extract-html-class";
import cssChange from "../../gulp-change-html-class";

/**
 *
 * @param {Config} cfg
 * @param {Function} reload
 * @returns {*}
 */
export function build(cfg, reload) {
	const destDir = `${cfg.dest.base}`;

	// !!cfg.env - env = undefined - false
	// !!!cfg.env - env = undefined - true
	// !!cfg.env - env = any - true
	// !!!cfg.env - env = any - false

	return src(`${cfg.src.base}/${cfg.src.html}/**/*.html`, `!${cfg.src.base}/${cfg.src.html}/**/_*.html`)
		// .pipe(gulpif(!!!cfg.env, changed(destDir)))
		.pipe(gih(cfg.gih))
		.pipe(gulpif(cfg.env === 'production', htmlmin({ collapseWhitespace: true })))
		.pipe(dest(destDir))
		.pipe(extractClass())
		.pipe(cssChange())
		.on('finish', () => reload ? reload() : null );
}
