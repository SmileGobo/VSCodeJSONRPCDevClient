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