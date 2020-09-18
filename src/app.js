const Bus = require('./core/Bus.js');
class Application {
    _bus = new Bus('client');
    constructor(){
        this._bus.init();
    }
    run() {
        let btn = document.querySelector("#add");
        let rqst_list = document.querySelector('rpc-requestlist') 
        btn.onclick = (e) => {
            rqst_list.addItem({method: 'Sample.Test.Hello', params:['Hello! mother fucker!']});
        }
        
        this._bus.on(
            'Request.insert',
            data => rqst_list.addItem(data)
        );
    }

}

let app = new Application();
app.run();