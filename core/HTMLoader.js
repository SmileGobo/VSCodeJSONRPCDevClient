const XMLDOM = require('xmldom');
const FS     = require('fs');

module.exports = class {
    _parser = new XMLDOM.DOMParser({
        errorHandler: (_, err) => { throw err}
    });

    _root   = null;
    fromString(html_str) {
        this._root = this._parser.parseFromString(html_str, 'text/html');
    }

    fromFile(path){
        let html_data = FS.readFileSync(path);
        this.fromString(html_str);
    }

    get root(){
        return this._root;
    }
}