'use strict';

import classList from './lazy-load.json';

class LazyLoad {
	constructor() {
		this.buttons = document.querySelectorAll(`.${classList.INIT_CLASS}`);

		this.init();
	}

	init() {
		this.addEventListener();
		this.buttons.forEach(button => {
			button.classList.remove(classList.INIT_CLASS);
			button.classList.add(classList.HIDDEN_CLASS);
		});
	}

	lazyLoad(target) {
		const io = new IntersectionObserver((entries, observer) => {
			console.log(entries);
			entries.forEach(entry => {
				console.log('😍');

				if (entry.isIntersecting) {
					const img = entry.target;
					const src = img.getAttribute('data-src');
					const copyImg = new Image();

					copyImg.src = src;
					copyImg.onload = function() {
						img.style.width = `${copyImg.width}px`;
						img.style.height = `${copyImg.height}px`;
						img.setAttribute('src', src);
						img.classList.remove(classList.HIDDEN_CLASS);
					};

					observer.disconnect();
				}
			});
		});

		io.observe(target);
	}

	addEventListener() {
		this.buttons.forEach(this.lazyLoad);
	}
}

const lazyLoad = new LazyLoad();

export default lazyLoad;
