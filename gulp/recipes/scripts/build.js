const gulp       = require('gulp');
const browserify = require('gulp-browserify');

module.exports = () => {
	return gulp.src('./src/bundles/**/*.js', {read: false})
		.pipe(browserify({
			transform: ['babelify']
		}))
		.pipe(gulp.dest('./dist/js'))
};