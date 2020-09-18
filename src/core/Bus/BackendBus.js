class BackendBus {
    
    constructor(){
        this._proxy = null;
    }
    set onMessage(action){
        this._proxy.onDidReceiveMessage = action;
    }

    init(proxy){
        this._proxy = proxy;
    }

    postMessage(msg){
        this._proxy.postMessage(msg);
    }

    set proxy(val){
        this._proxy = val;
    }
}

module.exports = BackendBus;