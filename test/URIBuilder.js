const URIBuilder = require('../core/URIBuilder');
const assert     = require('assert');
suite('URIBuilder', () => {
    let uri = null;
    setup(()=> uri = new URIBuilder());

    test('files', () => {
        assert.doesNotThrow(() => {
            uri.joinBasePath('/', 'hello', 'test');
            uri.schema = 'file';
        });
        
        let rslt = uri.make('file.js');
        assert.equal(rslt, 'file:/hello/test/file.js');
        assert.doesNotThrow(() => uri.schema = '');
        rslt = uri.make('file.xml');
        assert.equal(rslt, '/hello/test/file.xml');
    })

    test('sub_path', () => {
        assert.doesNotThrow(() => {
            uri.joinBasePath('/', 'hello', 'test');
            uri.schema = 'file';
        });
        
        let rslt = uri.make('sub/test/file.js');
        assert.equal(rslt, 'file:/hello/test/sub/test/file.js');
        assert.doesNotThrow(() => uri.schema = '');
        rslt = uri.make('dir/subDir');
        assert.equal(rslt, '/hello/test/dir/subDir');
    })
});