import bundleJS from '../gulp-bundle';
import extractClass from '@bemtools/gulp-extract-html-class';
import gih from "gulp-include-html";
import { src, dest } from 'gulp';

/**
 *
 * @param {Config} cfg
 * @returns {*}
 */
export function bundle(cfg) {
	return src(`${cfg.src.base}/${cfg.src.html}/**/*.html`)
		.pipe(gih(cfg.gih))
		.pipe(extractClass())
		.pipe(bundleJS({
			blocksPath: `${cfg.src.base}/${cfg.src.blocks}`,
			includesPath: `../${cfg.src.blocks}`,
			debug: false
		}))
		.pipe(dest(`${cfg.src.base}/${cfg.src.bundles}`));
}
