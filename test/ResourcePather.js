const ResourcePather = require ('../core/ResourcePather');
const assert  = require('assert');
const path    = require('path');
suite('ResourcePather', () => {
    let rp = null;
    setup(() => rp = new ResourcePather());

    test('setup html', () => {
        const html = '<html><head></head><body><body></html>';
        assert.doesNotThrow( () => {
            rp.html = html;
        }, 'trivial html data');

        assert.throws(() => {
            rp.html = ' ';
        }, 'check empty string');

        assert.throws(() => {
            rp.html = '<html><head</html>';
        }, 'wrong xml');
    });

    test('set base path', () => {
        assert.throws(() => rp.basePath = '', 'not empty path' );
        assert.doesNotThrow(() => rp.basePath = path.join(path.sep, 'test', 'test'));
        assert.doesNotThrow(() => rp.basePath = path.join(path.sep, 'test'));
    });

    test('fixResourceReferences setup', () => {
        assert.throws(() => rp.fixResourceReferences(), 'not setup');
        
        assert.doesNotThrow(() => rp.html = '<html></html>');
        assert.throws(() => rp.fixResourceReferences(), 'already not setup');
        assert.doesNotThrow(() => rp.basePath = path.join(path.sep, 'test', 'hello'));
        assert.doesNotThrow(() => rp.fixResourceReferences(), 'success setup');
    });
    const data = `<html>
                <head>
                    <link rel="stylesheet" href="UI/css/main.css">
                    <link rel="import" href="UI/components/test.html">
                    <script type="module" src="./test.js"></script>
                </head>
                <body>
                    <div id="app"></div>
                </body>
            </html>`;

    test('XPATH', () => {
        const XPATH  = require('xpath');
        const XML    = require('xmldom');
        const select = XPATH.useNamespaces({"x": "http://www.w3.org/1999/xhtml"})
        let parser = new XML.DOMParser({errorHandler: (lvl, err) => {throw err}});
        let root   = parser.parseFromString(data, 'text/html'); 
        let links =  select('//@href', root);
        assert.equal(links.length, 2);

        links = select('//x:link[@href]', root);
        assert.equal(links.length, 2);
    });
    test('fixResourceRefrences result', () => {
        
        
        assert.doesNotThrow(() => {
            rp.html     = data;
            rp.basePath = path.join(path.sep, 'home', '.local', 'share', 'plugins');
            rp.fixResourceReferences();
        });
        let rslt = '';
        assert.doesNotThrow(() => rslt = rp.html, 'read result');
        assert.notEqual(rslt.length, 0, 'result not empty');
        const count = (rslt.match(/vscode-resource/g) || []).length;
        assert.equal(count, 2, 'path success 2 nodes modified');
        
    });
});