import bundleSCSS from '@bemtools/gulp-bundle-scss';
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
		.pipe(bundleSCSS())
		.pipe(dest(`${cfg.src.base}/${cfg.src.bundles}`));
}
