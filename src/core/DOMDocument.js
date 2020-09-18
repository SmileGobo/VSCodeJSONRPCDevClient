const HTMLoader   = require('./HTMLoader.js');
const NodeLocator = require('./NodeLocator.js');

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

module.exports = DOMDocument;