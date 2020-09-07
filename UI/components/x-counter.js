class XCounter extends HTMLElement {
    set value(value) {
        this._value = value;
        this.valueElement.innerText = this._value;
    }

    get value() {
        return this._value;
    }

    constructor() {
        super();
        this._value = 0;
        let tmpl = document.querySelector("#x-counter");
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(tmpl.content.cloneNode(true));

        this.valueElement = shadow.querySelector('p');
        let btn = {
            inc: shadow.querySelectorAll('button')[1],
            dec: shadow.querySelectorAll('button')[0]
        }

        btn.inc.onclick = () => this.value++;
        btn.dec.onclick = () => this.value--;
    }
}

customElements.define('x-counter', XCounter);