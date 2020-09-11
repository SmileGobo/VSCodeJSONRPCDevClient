class LogInteraction extends HTMLElement {
    TEMPLATE_ID = '#log-interaction';
    constructor() {
        super();
        this._records = [];
    }
    connectedCallback() {
        let shadow = this.attachShadow({mode: 'open'});
        this._render(shadow);
        this._afterRender(shadow);
        // браузер вызывает этот метод при добавлении элемента в документ
        // (может вызываться много раз, если элемент многократно добавляется/удаляется)
    }

    _afterRender(shadow) {
        this._widjet = {
            title: shadow.querySelector('h2'),
            area : shadow.querySelector('textarea'),
            clear: shadow.querySelector('button')
        }
        this._widjet.title.innerText = this.getAttribute('title');
    }

    get count(){
        return this._records.length;
    }
    addMessage(text){
        this._records.push(text);
        this._widjet.area.value += `${this.count}:${text}\n`;

    }

    _render(shadow){
        let tmpl = document.querySelector(this.TEMPLATE_ID);
        shadow.appendChild(tmpl.content.cloneNode(true));
    }
}

customElements.define('rpc-log', LogInteraction);