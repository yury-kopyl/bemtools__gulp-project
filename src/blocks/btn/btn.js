'use strict';

import classList from './btn.json';

class Btn {
	constructor() {
		this.buttons = document.querySelectorAll(`.${classList.INIT_CLASS}`);

		this.init();
	}

	init() {
		this.addEventListener();
		this.buttons.forEach(button => {
			button.classList.remove(`.${classList.INIT_CLASS}`);
		});
	}

	static stopEventClick(event, element) {
		if ( element.classList.contains(`.${classList.DISABLED_CLASS}`) ) {
			event.preventDefault();
		}
	}

	addEventListener() {
		this.buttons.forEach(element => {
			element.addEventListener('click', (event) => {
				Btn.stopEventClick(event, element);
			})
		})
	}
}

const btn = new Btn();

export default btn;