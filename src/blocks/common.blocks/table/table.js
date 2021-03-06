'use strict';

import classList from './table.json';
import ColResize from './_table.js/colResie';

class Table {
	constructor() {
		this.tables = document.querySelectorAll('.table-js');

		this.init();
	}

	init() {
		this.tables.forEach(table => {
			let colResizeOptions = JSON.parse(table.attributes['data-bem'].nodeValue);
			new ColResize(table, colResizeOptions.table.colResize || {});

			table.classList.remove('table-js');
		});
	}
}

const table = new Table();

export  default table;
