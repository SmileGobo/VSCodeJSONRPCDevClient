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
    _ui    = new DOMDocument();
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
        try {
            this._createPanel();
            this._loadUI();
            this._panel.webview.html = this._ui.toString();
            this._loadDocument();
        }
        catch(e){
            console.log(e);
        }
    }

    _loadUI(){
        //if (this._ui.isLoad){
        //    return;
        //}
        this._ui.fromFile(this._uri.make('UI/index.html'));
        let html = this._ui.root;
        let body = this._ui.execXPath('//html:body')[0];
        let head = this._ui.execXPath('//html:head')[0];
        let tmplt = new DOMDocument();
        this._ui.execXPath('//html:link[@rel="import"]').forEach(node =>{
            const cname = node.getAttribute('href');
            this._uri.schema = 'vscode-resource';
            //заимпортить скрипт
            let script = html.createElement('script');
            script.setAttribute('type', 'module');
            script.setAttribute('src', this._uri.make(`UI/components/${cname}/index.js`));
            head.appendChild(script);
            
            //заимпортить шаблон
            this._uri.schema = '';
            tmplt.fromFile(this._uri.make(`UI/components/${cname}/template.html`));
            body.appendChild(tmplt.root);
        });
    }

    _createPanel(){
        if (!Object.is(this._panel, null)){
            this._panel.dispose(); //освобождаем панель и пересоздаем
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


    _loadDocument() {
        let doc = vscode.window.activeTextEditor.document;
        if (!doc){
            return;
        }
        for (let i=0; i < doc.lineCount; i++) {
            try{
                let line = JSON.parse(doc.lineAt(i).text);
                this._panel.webview.postMessage(line);
            }
            catch(e){
                console.log(e);
            }
        }
    }

}
module.exports = RPCTester;
