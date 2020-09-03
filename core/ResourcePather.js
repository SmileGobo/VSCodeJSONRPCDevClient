const xpath  = require('xpath');
const path   = require('path');
const xmldom = require('xmldom');

module.exports =  class {
    
    set html( html_data){
        this._html_doc = new xmldom.DOMParser().parseFromString(html_data);
    }

    get html() {
        let srlzr = new xmldom.XMLSerializer();
        return srlzr.serializeToString(this._html_doc);
        //this._html_doc.
    }
	set basePath(value){
		this._base_path = value;
	}

	_base_path = '';
    _html_doc = null;
    
    fixResourceReferences() {
        const link_attrs = ['href', 'src'];
        const modify_tags = Set(['link', 'script', 'import']);

        link_attrs.forEach(attr => {
            const xpath = `.//*[${attr}]`; 
            let nodes = xpath.evaluate(xpath, this._html_doc);
            nodes.forEach( node => {
                if (modify_tags.has(node.tagName)){
                    let link_path = node.getAttribute(attr);
                    link_path = `vscode-resource://${path.join(this._base_path, link_path)}`;
                    node.setAttribute('href', link_path);
                }
            });
        });
    }
}

