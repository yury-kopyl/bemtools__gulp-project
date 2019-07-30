const ERRORS = require('./errors');
const File = require('vinyl');
const fs = require('fs');
const through = require('through2');
const path = require('path');
const cache = {
    css: {},
    js: {}
};

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
        // const isChangedJS = isChangeClassList(file, options, 'js');
        // const isChangedCSS = isChangeClassList(file, options, 'css');

        // if (isChangedJS) {
            bundleJS.call(this, file, options);
        // }

        // if (isChangedCSS) {
            bundleCSS.call(this, file, options);
        // }
    } catch (err) {
        this.emit('error', new Error(`${ERRORS.SWWrong}${err}`));
        cb();
        return;
    }

    cb();
});

function bundleJS(file, options) {
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
}

function bundleCSS(file, options) {
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
                    if (options.debug) {
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
            let parsedString = item.includes('--') ? item.split('--') : item.split('_');
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
}

function isChangeClassList(file, options, type = 'css') {
    const fileName = path.basename(file.path).slice(0, -5);
    let classListString;

    if (type === 'js') {
        classListString = file.classList.filter((value, index) => {
            return file.classList.indexOf(value) === index && value.slice(-3) === '-js';
        });
    } else if (type === 'css') {
        classListString = file.classList.map(value => {
            return value.slice(-3) === options.jsSuffix ? value.slice(0, -3) : value;
        });
    }

    classListString = [... new Set(classListString)].sort().join();

    if (!fs.existsSync('.bemsk/cache')) {
        fs.mkdirSync('.bemsk/cache', {recursive: true});
    }

    if (!fs.existsSync(`.bemsk/cache/${fileName}_${type}`)) {
        cache[type][fileName] = classListString;
        fs.appendFileSync(`.bemsk/cache/${fileName}_${type}`, classListString);
        return true;
    } else {
        if (!cache[type][fileName]) {
            cache[type][fileName] = fs.readFileSync(`.bemsk/cache/${fileName}_${type}`, 'utf-8');
        }

        if (cache[type][fileName] !== classListString) {
            cache[type][fileName] = classListString;
            fs.appendFileSync(`.bemsk/cache/${fileName}_${type}`, classListString);
            return true;
        } else {
            return false;
        }
    }
}
