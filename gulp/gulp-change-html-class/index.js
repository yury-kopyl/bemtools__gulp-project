const path = require("path");
const ERRORS = require('./errors');
const through = require('through2');
const fs = require('fs');
const cache = {};

/**
 *
 * @returns {through} through object and the custom key "classList", which contains an array with a list of classes and SCSS bundle file
 */
module.exports = () => through.obj(function (file, enc, cb) {
	/*let options = Object.assign({
		blocksPath: './src/blocks',
		includesPath: '../blocks',
		jsSuffix: '-js',
		classList: undefined
	}, params);*/

	if (file.isStream()) {
		this.emit('error', new Error(ERRORS.isStream));
		cb();
		return;
	}

	if (!file.contents.length) {
		this.emit('error', new Error(ERRORS.isEmptyFile));
		cb();
		return;
	}

	try {
		const classListString = file.classList.join();
		const fileName = path.basename(file.path).slice(0, -5);

		if (!fs.existsSync('.bemsk/cache')) {
			fs.mkdirSync('.bemsk/cache', {recursive: true});
		}

		if (!fs.existsSync(`.bemsk/cache/${fileName}`)) {
			cache[fileName] = classListString;
			fs.appendFileSync(`.bemsk/cache/${fileName}`, classListString);
		} else {
			if (!cache[fileName]) {
				cache[fileName] = fs.readFileSync(`.bemsk/cache/${fileName}`, 'utf-8');
			} else if (cache[fileName] !== classListString) {
				cache[fileName] = classListString;
				fs.appendFileSync(`.bemsk/cache/${fileName}`, classListString);
			} else {
				cb();
				return;
			}
		}
	} catch (err) {
		this.emit('error', new Error(`${ERRORS.SWWrong}${err}`));
		cb();
		return;
	}

	this.push(file);
	cb();
});
