const ERRORS = require('./errors');
const File = require('vinyl');
const through = require('through2');
const fs = require('fs');
const path = require('path');

/**
 *
 * @returns {through} through object and the custom key "classList", which contains an array with a list of classes and JS bundle file
 */
module.exports = params => through.obj(function (file, enc, cb) {
	let options = Object.assign({
		blocksPath: './src/blocks',
		includesPath: '../blocks',
		classList: undefined,
		debug: false
	}, params);

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
		const folders = fs.readdirSync(`${options.blocksPath}`);
		let classes = options.classList ? options.classList : file.classList;

		classes = classes.filter((value, index) => {
			return classes.indexOf(value) === index && value.slice(-3) === '-js';
		}).map(value => {
			return value.slice(0, -3);
		}).sort();

		folders.forEach(folderName => {
			let oneOfFile = false;
			let fileContent = '';

			classes.forEach(item => {
				let parsedString = item.split('_');
				let fileName = parsedString.length === 1 ? `${item}/${item}` : `${parsedString[0]}/${item}`;
				let className = parsedString.length === 1 ? item : parsedString[0];

				if (className.includes('-')) {
					const classNameArray = className.split('-');
					className = '';

					classNameArray.forEach((item, index) => {
						if (!index) {
							className += item;
						} else {
							className += item.charAt(0).toUpperCase() + item.slice(1);;
						}
					})
				}

				if ( fs.existsSync(`${options.blocksPath}/${folderName}/${fileName}.js`) ) {
					oneOfFile = true;
					fileContent += `import ${className} from "${options.includesPath}/${folderName}/${fileName}";\n`;
				} else {
					fileContent += `//\t\t⚠ File does not exist ⚠\n// import ${className} from "${options.includesPath}/${folderName}/${fileName}";\n`;
					if (options.debug) {
						console.warn(`${ERRORS.fileNotExist}${options.includesPath}/${folderName}/${fileName}.js`);
					}
				}
			});

			if (oneOfFile) {
				const newFile = new File({
					base: file.base,
					path: `${path.dirname(file.path)}/${folderName.split('.')[0]}.${path.basename(file.path).slice(0, -4)}js`,
					contents: Buffer.from(fileContent)
				});

				this.push(newFile);
			}
		});

		/*file.contents = Buffer.from(fileContent);
		file.path = file.path.slice(0, -4);
		file.path += 'js';
		file.classList = classes;*/
	} catch (err) {
		this.emit('error', new Error(`${ERRORS.SWWrong}${err}`));
		cb();
		return;
	}

	// this.push(file);
	cb();
});
