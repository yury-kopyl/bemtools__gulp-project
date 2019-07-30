'use strict';

class ColResize {
	constructor(table, options) {
		this.table = table;
		this.heads = this.table.querySelectorAll('thead tr:first-child th');
		this.headsFixed = this.table.querySelectorAll('thead tr:first-child th[data-width]');
		this.options = Object.assign({}, ColResize.defaults, options);

		this.init();
	}

	init() {
		this.setHeadsWidth();
		this.setTableClass();
	}

	setHeadsWidth() {
		let tableWidth = this.table.parentElement.offsetWidth;

		console.log(tableWidth);
		console.log(this.headsFixed);

		this.headsFixed.forEach(head => {
			tableWidth -= head.attributes['data-width'].nodeValue;
		});

		console.log(tableWidth);

		this.heads.forEach(head => {
			/*if ( head.attributes['data-width'] ) {
				let width = head.attributes['data-width'] ? head.attributes['data-width'].nodeValue : tableWidth / (this.heads.length - this.headsFixed.length);

				head.style.width = `${width}px`
			}*/

			let width = head.attributes['data-width'] ? head.attributes['data-width'].nodeValue : tableWidth / (this.heads.length - this.headsFixed.length);

			head.style.width = `${width}px`
		})
	}

	setTableClass() {
		if ( !this.options.isFit ) {
			this.table.classList.add('table_width_full');
		}
	}
}

export default ColResize;

ColResize.defaults = {
	minWidth: 80
};