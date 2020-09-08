class LogInteraction extends HTMLDivElement {
    constructor() {
        super();
        let tmpl = document.querySelector("#log-interaction");
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(tmpl.content.cloneNode(true));

        this._records = [];
        this._widjet = {
            area : shadow.querySelector('textarea'),
            clear: shadow.querySelector('button')
        }
    }
}

customElements.define('log-intreaction', LogInteraction);