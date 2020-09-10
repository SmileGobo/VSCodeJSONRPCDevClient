function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
};
class ToggleButton {
    _state = false;
    _caption = {
        false: 'Connect',
        true: 'Disconnect' 
    }
    _clbck = null;

    _widjet = null;
    constructor(widjet){
        this._widjet = widjet;
        this._setCaption();
        this._widjet.onclick = this.toggle.bind(this);
    }
    toggle(){
        let update = !this._state;
        let success = () => {
            this._state = update;
            this._setCaption();
        }
        if (this._clbck){
            this._clbck(update).resolve(success)
        }
        else {
            success();
        }
    }
    _setCaption(){
        this._widjet.setAttribute('value', this._caption[this._state]);
    }

    set onToggle(val) {
        if (!isFunction(val)){
            throw TypeError('value must be function');
        }
        this._clbck = val;
    }
    reset(){
        this._state = false;
        this._setCaption;
    }

    set disabled(val){
        if (val){
            this._widjet.setAttribute('disabled', true);
        }
        else {
            this._widjet.removeAttribute('disbaled');
        }
    }
}
class SelectHelper{
    constructor(widjet){
        this._widjet = widjet;
        
    }

    get value(){
        return this._widjet.options[this._widjet.selectedIndex].value;
    } 

    set onChange(clbck) {
        this._widjet.onchange =  evt => {
            clbck(this);
        };
    }
    

}
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
        let form = shadow.querySelector('form').elements
        this._widjet = {
            title: shadow.querySelector('h2'),
            form,
            button: new ToggleButton(form.submit),
            select: new SelectHelper(form.proto)
        }
        this._widjet.title.innerText = this.getAttribute('title') || '';
        //this._widjet.form.submit.onclick = this.submit.bind(this);
        this._widjet.select.onChange = (w) => {
            let label = this._widjet.form.session.parentElement;
            if (w.value === 'TCP'){
                label.classList.remove('hidden');
            }
            else {
                label.classList.add('hidden');
            }
            
        }
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

