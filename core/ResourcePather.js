const XPATH  = require('xpath');
const path   = require('path');
const xmldom = require('xmldom');
const ASS    = require('assert'); 

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
    _html_doc  = null;
    //костыль благодоря котрому можно делать запросы  вида
    // '//x:<tag>...'
    //https://stackoverflow.com/questions/25753368/performant-parsing-of-pages-with-node-js-and-xpath
    _select    = XPATH.useNamespaces({"x": "http://www.w3.org/1999/xhtml"});
    _parser    = new xmldom.DOMParser({
        errorHandler: (_, msg) => {
            this._html_doc = null;
            throw msg;
        }
    });
    _checkState() {
        ASS.notEqual(this._html_doc, null, 'html not setup');
        ASS.notEqual(this._base_path, '', 'basePath not setup');
    }
    fixResourceReferences() {
        this._checkState();

        const rqsts = [
            {tag: 'link',   attr: 'href'},
            {tag: 'script', attr: 'src'}
        ];
        
        rqsts.forEach(rqst => {
            let xpath = `//x:${rqst.tag}[@${rqst.attr}]`;
            let nodes = this._select(xpath, this._html_doc);
            nodes.forEach( node => {
                const type = node.getAttribute('rel') || '';
                if (type === 'import' ){
                    //TODO вгрузку веб компонентов
                    return; 
                }
                let link_path = node.getAttribute(rqst.attr);
                //TODO скорректировать под винду
                link_path = `vscode-resource:${path.join(this._base_path, link_path)}`;
                node.setAttribute(rqst.attr, link_path);
            });
        });
    }
    injectCSPSource() {
        this._checkState();
        //<meta http-equiv="Content-Security-Policy" 
        //content="default-src 'none'; img-src ${csp_src}; script-src ${csp_src}; style-src ${csp_src}; "/>
        
        let head = this._html_doc.getElementsByTagName('head')[0];
        let meta = this._html_doc.createElement('meta');
        const csp_src = this._base_path;
        let content = `default-src 'none'; img-src ${csp_src}; script-src ${csp_src}; style-src ${csp_src};`
        meta.setAttribute('http-equiv', 'Content-Security-Policy');
        meta.setAttribute('content', content);
        head.appendChild(meta);
    }   
}

