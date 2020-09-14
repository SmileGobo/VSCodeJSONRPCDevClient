
class RequestItem {
    TEMPLATE_ID = '#request-list-item';
    constructor(row){
        let tmpl = document.querySelector(this.TEMPLATE_ID);
        row.appendChild(tmpl.content.cloneNode(true));
        let cells = row.querySelectorAll('td'); 
        this._widjet = {
            num   : cells[0],
            method: cells[1],
            params: cells[2],
            send:   row.querySelector('input[name=send]')
        };
    }

    set num(val){
        this._widjet.num.innerText = val;
    }

    set method(val) {
        this._widjet.method.innerText = val;
    }

    set params(val) {
        this._widjet.params.innerText = JSON.stringify(val);
    }

    set onSend(action) {
        this._widjet.send.onclick = action;
    }
}
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
        this._widjet = shadow.querySelector('table');
    }

    _render(shadow){
        let tmpl = document.querySelector(this.TEMPLATE_ID);
        shadow.appendChild(tmpl.content.cloneNode(true));
    }

    addItem(value){
        let row = new RequestItem(this._widjet.insertRow());
        row.num    = this._records.length;
        row.method = value.method;
        row.params = value.params;
        this._records.push(value);
        row.onSend = this._onSend.bind(this, value);
    }

    _onSend(val){
        console.log(`send: ${val}`);
    }
}

customElements.define('rpc-requestlist', RequestList);