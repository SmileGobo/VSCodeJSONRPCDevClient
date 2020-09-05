// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

const vscode = require('vscode');
const fs     = require('fs');
const path 	 = require('path');

const ResourcePather  = require('./core/ResourcePather');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rpctester" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World!');
		let ui_root = path.join(context.extensionPath, 'UI');
		let panel = vscode.window.createWebviewPanel(
			'JSONRPCTester', // Identifies the type of the webview. Used internally
			'JSONRPC Tester', // Title of the panel displayed to the user
			vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.file(ui_root)
				]
			} // W
		);
		let rp = new ResourcePather();
		rp.basePath = ui_root;
		rp.html     = loadUI(ui_root);
		rp.fixResourceReferences();
		//rp.injectCSPSource();
		panel.webview.html = rp.html;
		//panel.webview.html = `<textarea>${rp.html}</textarea>`;

	});

	context.subscriptions.push(disposable);
}


function fixResourceReferences(html, resourceRootDir, view) {
	const refRegex = /((href)|(src))="(\.\/[^"]+)"/g;
	let refMatch;
	while ((refMatch = refRegex.exec(html)) !== null) {
		const offset  	= refMatch.index;
		const length  	= refMatch[0].length;
		const refAttr 	= refMatch[1];
		const refName 	= refMatch[4];
		const refPath 	= path.join(resourceRootDir, refName);
		const refReplace = `${refAttr}="vscode-resource:${refPath}"`;
		html = html.slice(0, offset) + refReplace + html.slice(offset + length);
	}
	return html;
}

/**
 * Replace references to ${webview.cspSource} with the actual value.
 */
function fixCspSourceReferences(html, view){
	const cspSourceRegex = /\${cspSource}/g;
	let cspSourceMatch;
	while ((cspSourceMatch = cspSourceRegex.exec(html)) !== null) {
		html = 
			html.slice(0, cspSourceMatch.index) 
				+ view.cspSource 
				+ html.slice(
					cspSourceMatch.index + cspSourceMatch[0].length
				)
		;
	}

	return html;
}

function loadUI(base_path){
	let fname = path.join(base_path, 'index.html');

	vscode.window.showInformationMessage(fname);
	
	return fs.readFileSync(fname, 'utf-8');
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
