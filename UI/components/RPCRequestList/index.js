class RequestList extends HTMLElement {
    TEMPLATE_ID = '#request-list';
    CHILD_NAME  = 'rpc-request';
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
          
        }
    }

    _render(shadow){
        let tmpl = document.querySelector(this.TEMPLATE_ID);
        shadow.appendChild(tmpl.content.cloneNode(true));
    }
}

customElements.define('rpc-requestlist', RequestList);