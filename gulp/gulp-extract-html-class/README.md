[![NPM version](https://img.shields.io/badge/npm-1.0.2-blue.svg)](https://www.npmjs.com/package/@bemtools/gulp-extract-html-class)
[![Build Status](https://travis-ci.org/yury-kopyl/bemtools__gulp-extract-html-class.svg?branch=master)](https://travis-ci.org/yury-kopyl/bemtools__gulp-extract-html-class)

Extracts all classes from the html

## Installation

> npm install @bemtools/gulp-extract-html-class --save

## Sample gulpfile.js

This file will give you a taste of what plugin does.

```javascript
const gulp         = require('gulp');
const extractClass = require('@bemtools/gulp-extract-html-class');
const through      = require('through2');

function logClasses() {
	let PLUGIN_NAME = 'logClasses';

	return through.obj(function (file, enc, cb) {
		if (!file.contents.length) {
			this.push(null);
			cb(console.log(` ⚠ ${PLUGIN_NAME}: The file is empty `));
			return;
		}

		try {
			// the file has a custom value "classList"
			console.log(file.classList);
		} catch (err) {
			cb(console.log(` ⚠ ${PLUGIN_NAME}: Something went wrong: `, err));
			return;
		}

		this.push(file);
		cb();
	});
}

gulp.task('default', function () {
	return gulp.src('./src/templates/**/*.html')
		.pipe(extractClass())
		.pipe(logClasses())
		.pipe(gulp.dest('./dist/html/'));
});
```