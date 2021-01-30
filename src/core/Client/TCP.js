const {Socket} = require('net');

class TCP {
    _host = '';
    _port = 0;
    _session = 0;
    _socket = new Socket();
    _ready  = false;
    constructor(host, port){
        this._socket.on('ready', () => this._ready = true);
        this._socket.on('close', () => this._ready = false);
        this._socket.on('error', () => this._ready = false);
    }

    send(data){
        if (!this.isReady){
            throw Error('can\'t send data: socket not ready')
        }
        this._socket.write(data + '\n');
    }

    up() {

    }

    down() {

    }

    set onClose(action){

    }

    get isReady() {
        return this._ready;
    }
}

module.exports = TCP;