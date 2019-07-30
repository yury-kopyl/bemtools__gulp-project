import * as fs from 'fs';
import * as path from 'path';

function fileList(dir) {
    return fs.readdirSync(dir).reduce((list, file) => {
        const name = path.join(dir, file);

        return list.concat(fs.statSync(name).isDirectory() ? fileList(name) : [name]);
    }, []);
}

console.log(fileList('src/blocks'));

/**
 * Nested
project
    common.blocks/                             # Уровень переопределения с блоками
        input/                                 # Директория блока input
            _type/                             # Директория модификатора input_type
                input_type_search.css          # Реализация модификатора input_type в технологии CSS
            __clear/                           # Директория элемента input__clear
                _visible/                      # Директория модификатора input__clear_visible
                    input__clear_visible.css   # Реализация модификатора input__clear_visible в технологии CSS
                input__clear.css               # Реализация элемента input__clear в технологии CSS
                input__clear.js                # Реализация элемента input__clear в технологии JavaScript
            input.css                          # Реализация блока input в технологии CSS
            input.js                           # Реализация блока input в технологии JavaScript
 **/


/**
 * Flat
project
    common.blocks/
        input_type_search.css                  # Модификатор input_type_search в технологии CSS
        input_type_search.js                   # Модификатор input_type_search в технологии Javascript
        input__clear.js                        # Опциональный элемент блока input
        input.css
        input.js
        popup.css
        popup.js
        popup.png
 **/


/**
 * Flex
project
    common.blocks/
        input/                                 # Директория блока input
            _type/                             # Директория модификатора input_type
                input_type_search.css          # Реализация модификатора input_type в технологии CSS
            __clear/                           # Директория элемента input__clear
                _visible/                      # Директория модификатора input__clear_visible
                    input__clear_visible.css   # Реализация модификатора input__clear_visible в технологии CSS
                input__clear.css               # Реализация элемента input__clear в технологии CSS
                input__clear.js                # Реализация элемента input__clear в технологии JavaScript
            input.css                          # Реализация блока input в технологии CSS
            input.js                           # Реализация блока input в технологии JavaScript
        popup/                                 # Директория блока popup
            popup.css
            popup.js
            popup.png
 **/


/**
 * Shallow
project
    common.blocks/
        input/                                 # Директория блока input
            input.css                          # Реализация блока input в технологии CSS
            input.js                           # Реализация блока input в технологии JavaScript
            input_type_search.css              # Реализация модификатора input_type в технологии CSS
            input__clear_visible.css           # Реализация модификатора input__clear_visible в технологии CSS
            input__clear.css                   # Реализация элемента input__clear в технологии CSS
            input__clear.js                    # Реализация элемента input__clear в технологии JavaScript
        popup/                                 # Директория блока popup
            popup.css
            popup.js
            popup.png
 */
