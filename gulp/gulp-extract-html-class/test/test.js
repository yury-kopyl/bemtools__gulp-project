const assert       = require('assert');
const extractClass = require('../');
const ERRORS       = require('../errors');
const gulp         = require('gulp');
const path         = require('path');
const streaming    = () => { return path.join(__dirname, '*') };

describe('extract classes from html', () => {
	it("should return an array when html has classes", done => {
		gulp.src('./test/has.html')
			.pipe(extractClass())
			.once('data', data => {
				assert.deepEqual(data.classList, [
					"content",
					"footer",
					"header",
					"page",
					"page__content",
					"page__footer",
					"page__header"
				]);
				done();
			});
	});

	it("should return an empty array when the html has no classes", done => {
		gulp.src('./test/has_no.html')
			.pipe(extractClass())
			.once('data', data => {
				assert.deepEqual(data.classList, []);
				done();
			});
	});

	it(`should throw the error and display the message "${ERRORS.isEmptyFile}" when file is empty`, done => {
		gulp.src('./test/empty.html')
			.pipe(extractClass())
			.once('error', err => {
				assert.strictEqual(err.message, ERRORS.isEmptyFile);
				done();
			});
	});

	it(`should throw the error and display the message "${ERRORS.isNotHTML}" when file is not html`, done => {
		gulp.src('./test/not_html.txt')
			.pipe(extractClass())
			.once('error', err => {
				assert.strictEqual(err.message, ERRORS.isNotHTML);
				done();
			});
	});

	it(`should throw the error and display the message "${ERRORS.isStream}" when is stream`, done => {
		gulp.src(streaming(), { buffer: false })
			.pipe(extractClass())
			.once('error', function (err) {
				assert.strictEqual(err.message, ERRORS.isStream);
				done();
			});
	});
});