
class CommandHandler{
    constructor(provider){
        this._provider = provider;
        this._provider.onMessage = this.proccess.bind(this);
    }
    postCommand(name, data){
        this._provider.postMessage({command:name, data});
    }

    proccess(msg){
        let action = this._hndlrs[msg.command] || null;
        if (!action){
            return;
        }
        action(msg.data);
    }
    _hndlrs = {}
    on(cmd, action){
        this._hndlrs[cmd] = action;
    }

    off(cmd){
        delete this._hndlrs[cmd];
    }

}

module.exports = CommandHandler;