const { AssertionError } = require('assert');

const IMPL = {
    'tcp': require('./TCP.js'),
    'ws':  require('./WS.js')
}

class Connection {
    _impl       = null;
    _id         = 1;
    _session    = null;
    constructor(type, cfg = {}){
        if (!IMPL.hasOwnProperty('type')){
            throw AssertionError('Connection(): incorrect type');
        }
        
        this._impl = new IMPL[type](...cfg);
    }

    send(data){
        this._impl.send(data);
    }
    /**
     * @return {Promise}
     */
    connect(){
        return this._impl.connect();
    }
    set onData(clbk){

    }

    set onDisconnect(ckbck){

    }

    get isReady(){
        return this._impl.isReady;
    }
}

module.exports = Connection;