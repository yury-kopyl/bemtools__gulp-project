import classList from './example.json';

class Example {
    constructor() {
        this.elements = document.querySelectorAll(`.${classList.INIT_CLASS} .example__pre`);

        this.init();
        document.querySelector('.example-js').classList.remove('example-js');
    }

    init() {
        this.addEventListener();
    }

    static copyToClipboard(str) {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    addEventListener() {
        this.elements.forEach(element => {
            element.addEventListener('click', (event) => {
                const el = event.target;

                Example.copyToClipboard(el.innerText);
                el.setAttribute('data-title', 'Copied!');
            });

            element.addEventListener('mouseleave', (event) => {
                const el = event.target;

                el.setAttribute('data-title', 'Click to copy');
            })
        })
    }
}

const example = new Example();

export default example;
