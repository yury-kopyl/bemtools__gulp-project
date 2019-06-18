import bundleJS from '@bemtools/gulp-bundle-js';
import extractClass from '@bemtools/gulp-extract-html-class';
import { src, dest } from 'gulp';

/**
 *
 * @param {Config} cfg
 * @returns {*}
 */
export function bundle(cfg) {
	return src(`${cfg.src.html}/**/*.html`)
		.pipe(extractClass())
		.pipe(bundleJS())
		.pipe(dest(`${cfg.src.base}/${cfg.src.bundles}`));
}
