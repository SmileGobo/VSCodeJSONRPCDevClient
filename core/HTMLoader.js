const XMLDOM = require('xmldom');
const FS     = require('fs');
const ASS    = require('assert');

module.exports = class {
    _parser = new XMLDOM.DOMParser({
        errorHandler: (_, err) => { throw err}
    });

    _root   = null;
    fromString(html_str) {
        this._root = this._parser.parseFromString(html_str, 'text/html');
    }

    fromFile(path){
        let html_data = FS.readFileSync(path, 'utf-8');
        this.fromString(html_data);
    }

    get root(){
        return this._root;
    }

    get isLoad() {
        return !Object.is(this._root, null);
    }

    toString(){
        ASS.notEqual(this.isLoad, false, 'data not loaded');
        let srlzr = new XMLDOM.XMLSerializer();
        return srlzr.serializeToString(this._root);
    }
}