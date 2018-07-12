const gulp    = require('gulp');
const sass    = require('gulp-sass');
const minify  = require('gulp-clean-css');
const csscomb = require('gulp-csscomb');
const rename  = require('gulp-rename');

module.exports = () => {
	return gulp.src('./src/bundles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(csscomb({configPath: '.csscomb.json'}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(minify({debug: true}))
		.pipe(rename({extname: '.min.css'}))
		.pipe(gulp.dest('./dist/css'));
};