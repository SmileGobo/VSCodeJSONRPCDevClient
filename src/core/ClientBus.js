
class ClientBus{
    constructor(){
        this._proxy = acquireVsCodeApi() || null;
        if (!this._proxy){
            throw AssertionError('incorrect vscode api');
        }
    }

    set onMessage(action) {
        window.addEventListener('message', action);
    }

    postMessage(msg){
        this._proxy.postMessage(msg);
    }
}
module.exports = ClientBus;