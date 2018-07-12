const gulp     = require('gulp');
const lazy     = require('./gulp/utils/lazyRequire');
const sequence = require('run-sequence');
const watch    = require('gulp-watch');


/**
 * CSS distribution
 */
gulp.task('styles:bundle', [], lazy(require, './gulp/recipes/styles/bundle'));
gulp.task('styles:build', [], lazy(require, './gulp/recipes/styles/build'));
gulp.task('styles:dist', done => {
	sequence('styles:bundle', 'styles:build', done);
});

gulp.task('styles:watch:bundle', () => {
	return gulp.src('./src/html/**/*.html')
		.pipe(watch('./src/html/**/*.html', () => {
			gulp.start('styles:bundle');
		}));
});
gulp.task('styles:watch:build', () => {
	return gulp.src(['./src/blocks/**/*.scss', './src/bundles/**/*.scss'])
		.pipe(watch(['./src/blocks/**/*.scss', './src/bundles/**/*.scss'], () => {
			gulp.start('styles:build');
		}));
});
gulp.task('styles:watch', ['styles:watch:bundle', 'styles:watch:build']);


/**
 * JS distribution
 */
gulp.task('scripts:build', [], lazy(require, './gulp/recipes/scripts/build'));
gulp.task('scripts:bundle', [], lazy(require, './gulp/recipes/scripts/bundle'));
gulp.task('scripts:dist', done => {
	sequence('scripts:bundle', 'scripts:build', done);
});

gulp.task('scripts:watch:bundle', () => {
	return gulp.src('./src/html/**/*.html')
		.pipe(watch('./src/html/**/*.html', () => {
			gulp.start('scripts:bundle');
		}));
});
gulp.task('scripts:watch:build', () => {
	return gulp.src(['./src/blocks/**/*.js', './src/bundles/**/*.js'])
		.pipe(watch(['./src/blocks/**/*.js', './src/bundles/**/*.js'], () => {
			gulp.start('scripts:build');
		}));
});
gulp.task('scripts:watch', ['scripts:watch:bundle', 'scripts:watch:build']);