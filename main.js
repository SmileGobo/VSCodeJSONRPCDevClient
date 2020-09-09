const vscode = require('vscode');
const URIBuilder  = require('./core/URIBuilder');
const HTMLoader   = require('./core/HTMLoader');
const NodeLocator = require('./core/NodeLocator');

class DOMDocument extends HTMLoader {
    constructor(){
        super();
        this._locator = new NodeLocator();
    }

    fromString(html_data) {
        super.fromString(html_data);
        this._locator.root = super.root;
    }

    execXPath(query){
        return this._locator.execXPath(query);
    }
}
class RPCTester {
    _panel = null;
    _uri   = new URIBuilder()
    _count = 0;
    activate(context){
        this._uri.basePath = context.extensionPath;

        let disposable = vscode.commands.registerCommand(
            'extension.helloWorld', 
            this._onActivate.bind(this)
        );
        context.subscriptions.push(disposable);
    }
    deactivate() {
        this._panel.dispose();
    }
    _onActivate() {
        console.log('Plugin activated');
        this._createPanel();
        this._count++;
        this._panel.webview.html = `<h1> hello!${this._count}</h1>`;
    }

    _createPanel(){
        //надо корректно очищать панель
        if (!Object.is(this._panel, null)){
            this._panel.dispose();
        }
        // но при повторном вызове надо как-то туже панель использовать?
        this._panel = vscode.window.createWebviewPanel(
			'JSONRPCTester', // Identifies the type of the webview. Used internally
			'JSONRPC Tester', // Title of the panel displayed to the user
			vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.file(this._uri.make('UI'))
				]
			} // W
        );
        this._panel.onDidDispose(()=> this._panel = null);
    }

}
module.exports = RPCTester;
/*
function main(pwd) {
    //загрзка UI
    let ui = new HTMLoader();
    ui.load(path.join('pwd', 'UI', 'index.html'));

    //патчиг script
    let node_locator = new NodeLocator(ui.root, 'html');
    let uri = new URIBuilder();
    uri.schema   = 'vscode-resource';
    uri.basePath = path.join(pwd, 'UI'); 
    node_locator.byXPath('//html:script[@src]').forEach( node => {
        spath = node.getAttribute('src');
        node.setAttribute(uri.make(spath));
    });

    uri.basePath = path.join(pwd, 'components');
    let head = node_locator.byTag('head')[0];
    let body = node_locator.byTag('body')[0];
    
    node_locator.byXPath('//html:link[@rel="import"]').forEach((node) =>{
        let cname = node.getAttribute('href');
        let script = ui.root.createElement('script');
        script.setAttribute('src', uri.make(path.join('UI', 'component', cname,  'index.js')));
        script.setAttribute('type', 'module');
        head.appendChild(script);
        let tmplt = new HTMLoader();
        tmplt.load(path.join(pwd, 'UI', 'components', cname, 'template.html'));
        body.appendChild(tmplt.root);
        //удаляем <link rel="import"...>
        node.parenNode.removeChild(node);
    });

}
*/