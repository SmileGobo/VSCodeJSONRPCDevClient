class BackendProxy {
    constructor(proxy){
        this._proxy = proxy;
    }
    set onMessage(action){
        this._proxy.onDidReceiveMessage = action;
    }

    postMessage(msg){
        this._proxy.postMessage(msg);
    }
}