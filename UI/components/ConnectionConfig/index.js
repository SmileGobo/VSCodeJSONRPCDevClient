customElements.define('connection-config', class LogInteraction extends HTMLElement {
    TEMPLATE_ID = '#connection-config';
    constructor() {
        super();
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
            form:  shadow.querySelector('form').elements
        }
        this._widjet.title.innerText = this.getAttribute('title') || '';
        this._widjet.form.submit.onclick = this.submit.bind(this);
    }

    _render(shadow){
        let tmpl = document.querySelector(this.TEMPLATE_ID);
        shadow.appendChild(tmpl.content.cloneNode(true));
    }

    submit(){
        let rslt = {
            protocol: this.protocol,
            host:     this._getFormItem('host').value,
            port:     this._getFormItem('port').value,
            session:  this._getFormItem('session').value
        }
        console.log(rslt);
    }


    _getFormItem(name){
        this._widjet.form[name];
    }
    set host(val){
        this._getFormItem('host').value = val;
    }

    set port(val){
        if(!Number.isInteger(val)){
            throw 'incorrect error'
        }
        if (!(val > 0 && val <65536)){
            throw 'not in range'
        }
        this._getFormItem('port').value = val;
    }

    set protocol(val){
        let proto = this._getFormItem('proto');
        let items = protocol.options.map(item => item.value);
        let index = ites.indexOf(val);
        if (-1 === index){
            throw 'invalid value';
        }
        proto.selectedIndex = index;
    }

    get protocol(){
        let protocol = this._getFormItem('proto');
        return protocol.options[protocol.selectedIndex].value;
    }
});

