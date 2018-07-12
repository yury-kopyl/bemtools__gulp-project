const gulp         = require('gulp');
const extractClass = require('@bemtools/gulp-extract-html-class');
const bundleSCSS   = require('@bemtools/gulp-bundle-scss');

module.exports = () => {
	return gulp.src('./src/html/**/*.html')
		.pipe(extractClass())
		.pipe(bundleSCSS())
		.pipe(gulp.dest('./src/bundles'));
};