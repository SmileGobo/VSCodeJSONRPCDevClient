const NodeLocator = require ('../core/NodeLocator');
const HTMLoader   = require('../core/HTMLoader');
const assert    = require('assert');

suite('NodeLocator', () => {
    let node_locator = new NodeLocator();
    let loader       = new HTMLoader();


    test('setup html', () => {
        const html = '<html><head></head><body><body></html>';
        assert.doesNotThrow( () => {
            loader.fromString(html);
            node_locator.root = loader.root;
        }, 'trivial html data');

        let rslt = node_locator.execXPath('//html:head');
        assert.equal(rslt.length, 1);
        assert.equal(rslt[0].tagName, 'head');

        rslt = node_locator.execXPath('/html:html/html:body');
        assert.ok(rslt.length >= 1);
        assert.equal(rslt[0].tagName, 'body');

    });

    test('check query', () => {
        const html = `<html>
            <head>
                <script src="test"></script>
                <link rel="import" href="test/test">
            </head>
            <body><body>
        </html>`;
        assert.doesNotThrow( () => {
            loader.fromString(html);
            node_locator.root = loader.root;
        }, 'trivial html data');

        let rslt = node_locator.execXPath('//html:link[@rel="import"]');
        assert.equal(rslt.length, 1);
        assert.equal(rslt[0].tagName, 'link');
        assert.equal(rslt[0].getAttribute('rel'), 'import')

        rslt = node_locator.execXPath('//html:script[@src]');
        assert.equal(rslt.length, 1);
        assert.equal(rslt[0].tagName, 'script');
    });
})