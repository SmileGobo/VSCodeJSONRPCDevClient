// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below


const Plugin = require('./main');
let plugin = new Plugin();


module.exports = {
	activate:   plugin.activate.bind(plugin),
	deactivate: plugin.deactivate.bind(plugin) 
}
