const ERRORS = require('./errors');
const through = require('through2');

/**
 *
 * @returns {through} through object and the custom key "classList", which contains an array with a list of classes
 */
module.exports = () => through.obj(function (file, enc, cb) {
	if (file.isStream()) {
		this.emit('error', new Error(ERRORS.isStream));
		cb();
		return;
	}

	if (file.path.slice(-5) !== '.html') {
		this.emit('error', new Error(ERRORS.isNotHTML));
		cb();
		return;
	}

	if (!file.contents.length) {
		this.emit('error', new Error(ERRORS.isEmptyFile));
		cb();
		return;
	}

	try {
		let data        = file.contents.toString();
		let regexpClass = /class=["']?([\d\w-_ ]+)+["']?/g;
		let classList   = [];
		let res;

		while (true) {
			res = regexpClass.exec(data);
			if (!res) {
				break;
			}
			classList = classList.concat(res[1].split(' '));
		}

		file.classList = [... new Set(classList)].sort();
	} catch (err) {
		this.emit('error', new Error(`${ERRORS.SWWrong}${err}`));
		cb();
		return;
	}

	this.push(file);
	cb();
});
