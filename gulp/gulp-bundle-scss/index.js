const ERRORS = require('./errors');
const File = require('vinyl');
const fs = require('fs');
const through = require('through2');
const path = require('path');

/**
 *
 * @returns {through} through object and the custom key "classList", which contains an array with a list of classes and SCSS bundle file
 */
module.exports = params => through.obj(function (file, enc, cb) {
	let options = Object.assign({
		blocksPath: './src/blocks',
		includesPath: '../blocks',
		jsSuffix: '-js',
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
		let jsClassList = [];
		let classes = options.classList ? options.classList : file.classList;

		classes.forEach((item, index) => {
			folders.forEach(folderName => {
				if ( item.slice(-3) === options.jsSuffix ) {
					let parsedClassName = item.slice(0, -3);
					let parsedString = parsedClassName.split('_');
					let filePath = parsedString.length === 1 ? `../../${options.blocksPath}/${folderName}/${parsedClassName}/${parsedClassName}.json` : `${options.blocksPath}/${folderName}/${parsedString[0]}/${parsedClassName}.json`;

					try {
						let includeClassFromJS = require(filePath);

						for( let key in includeClassFromJS ) {
							if ( includeClassFromJS.hasOwnProperty(key) ) {
								if ( includeClassFromJS[key] === item ) {
									classes[index] = parsedClassName;
								} else {
									jsClassList.push(includeClassFromJS[key]);
								}
							}
						}
					} catch (e) {
						if (options.designMode) {
							console.warn(`${ERRORS.fileNotExist}${filePath}`);
						}
					}
				}
			});
		});

		classes = [... new Set(classes.concat(jsClassList))].sort();

		folders.forEach(folderName => {
			let oneOfFile = false;
			let fileContent = '';

			classes.map(item => {
				let parsedString = item.split('_');
				let fileName = parsedString.length === 1 ? `${item}/${item}` : `${parsedString[0]}/${item}`;

				if ( fs.existsSync(`${options.blocksPath}/${folderName}/${fileName}.scss`) ) {
					oneOfFile = true;
					fileContent += `@import "${options.includesPath}/${folderName}/${fileName}";\n`;
				} else {
					fileContent += `//\t\t⚠ File does not exist ⚠\n// @import "${options.includesPath}/${folderName}/${fileName}.scss";\n`;
					if (options.debug) {
						console.warn(`${ERRORS.fileNotExist}${options.includesPath}/${folderName}/${fileName}.scss`);
					}
				}
			});

			if (oneOfFile) {
				const newFile = new File({
					base: file.base,
					path: `${path.dirname(file.path)}/${folderName.split('.')[0]}.${path.basename(file.path).slice(0, -4)}scss`,
					contents: Buffer.from(fileContent)
				});

				this.push(newFile);
			}
		});

		/*file.contents = Buffer.from(fileContent);
		file.path = file.path.slice(0, -4);
		file.path += 'scss';
		file.classList = classes;*/
	} catch (err) {
		this.emit('error', new Error(`${ERRORS.SWWrong}${err}`));
		cb();
		return;
	}

	/*this.push(file);*/
	cb();
});
