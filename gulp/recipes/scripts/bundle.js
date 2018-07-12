const gulp         = require('gulp');
const extractClass = require('@bemtools/gulp-extract-html-class');
const bundleJS     = require('@bemtools/gulp-bundle-js');

module.exports = () => {
	return gulp.src('./src/html/**/*.html')
		.pipe(extractClass())
		.pipe(bundleJS())
		.pipe(gulp.dest('./src/bundles'));
};