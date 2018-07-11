const gulp         = require('gulp');
const extractClass = require('@bemtools/gulp-extract-html-class');
const bundleSCSS   = require('@bemtools/gulp-bundle-scss');
const bundleJS     = require('@bemtools/gulp-bundle-js');

gulp.task('bundle:scss', () => {
	return gulp.src('./src/html/**/*.html')
		.pipe(extractClass())
		.pipe(bundleSCSS())
		.pipe(gulp.dest('./src/bundles'));
});

gulp.task('bundle:js', () => {
	return gulp.src('./src/html/**/*.html')
		.pipe(extractClass())
		.pipe(bundleJS())
		.pipe(gulp.dest('./src/bundles'));
});