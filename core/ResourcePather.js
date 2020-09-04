const XPATH  = require('xpath');
const path   = require('path');
const xmldom = require('xmldom');
const ASS    = require('assert'); 
const { assert } = require('console');
module.exports =  class {
    //TODO ResourceLocator
    //addFilter({tag, attr});
    //removeFilter()
    //clear()
    set html( html_data){
        html_data = html_data.trim();
        ASS.ok(!!html_data, 'require_not empty string');

        this._html_doc = this._parser.parseFromString(html_data, 'text/html');
        //console.log(this._html_doc);
    }

    get html() {
        ASS.notEqual(this._html_doc, null);
        let srlzr = new xmldom.XMLSerializer();
        return srlzr.serializeToString(this._html_doc);
    }
	set basePath(value){
        ASS.ok(path.isAbsolute(value), 'Absolute path required');
        let data = path.parse(value);
        ASS.ok(!!data.dir, 'empty value not allow');
		this._base_path = value.trim();
	}

	_base_path = '';
    _html_doc = null;
    _parser   = new xmldom.DOMParser({
        errorHandler: (_, msg) => {
            this._html_doc = null;
            throw msg;
        }
    });
    
    fixResourceReferences() {
        ASS.notEqual(this._html_doc, null, 'html not setup');
        ASS.notEqual(this._base_path, '', 'basePath not setup');

        const rqsts = [
            {tag: 'link',   attr: 'href'},
            {tag: 'script', attr: 'src'}
        ];
        //костыль благодоря котрому можно делать запросы  вида
        // '//x:<tag>...'
        //https://stackoverflow.com/questions/25753368/performant-parsing-of-pages-with-node-js-and-xpath
        const select = XPATH.useNamespaces({"x": "http://www.w3.org/1999/xhtml"});
        rqsts.forEach(rqst => {
            let xpath = `//x:${rqst.tag}[@${rqst.attr}]`;
            let nodes = select(xpath, this._html_doc);
            nodes.forEach( node => {
                const type = node.getAttribute('rel') ?? '';
                if (type === 'import' ){
                    //TODO вгрузку веб компонентов
                    return; 
                }
                let link_path = node.getAttribute(rqst.attr);
                //TODO скорректировать под винду
                link_path = `vscode-resource:/${path.join(this._base_path, link_path)}`;
                node.setAttribute(rqst.attr, link_path);
            });
        });
    }
}

