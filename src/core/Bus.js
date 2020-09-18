const Impl = {
    client:  require('./ClientBus.js'),
    backend: require('./BackendBus.js')
};
//const IMPL = require('./ClientBus.js'); 
class Bus {

    constructor(type) {
        ///WARNING ЕБАНЫЙ Броузерифи не умеет class properties
        ///Пидоры ебаные

        this._bus = new Impl[type]();
        this._hndlrs = {};
        
    }

    init(){
        if ('init' in this._bus){
            this._bus.init(...arguments);
        }
        this._bus.onMessage = this.proccess.bind(this);
    }
    post(name, data){
        this._bus.postMessage({command:name, data});
    }

    proccess(evt){
        const msg = evt.data;
        console.log(msg);
        console.log(this._hndlrs)
        let action = this._hndlrs[msg.command] || null;
        if (!action){
            return;
        }
        action(msg.data);
    }
    
    on(cmd, action){
        this._hndlrs[cmd] = action;
    }

    off(cmd){
        delete this._hndlrs[cmd];
    }

}

module.exports = Bus;