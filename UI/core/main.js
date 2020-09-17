const Command = {
    Proxy:  require('./ClientProxy.js'),
    Handler: require('./CommandHandler.js') 
}

let btn = document.querySelector("#add");
let rqst_list = document.querySelector('rpc-requestlist') 
btn.onclick = (e) => {
    rqst_list.addItem({method: 'Sample.Test.Hello', params:['Hello! mother fucker!']});
}

window.addEventListener('message', event => {
    const message = event.data; // The JSON data our extension sent
    rqst_list.addItem(message);
});