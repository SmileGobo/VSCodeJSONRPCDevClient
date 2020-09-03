const ResourcePather = require ('../core/ResourcePather');

suite('ResourcePather', () => {
    let rp = new ResourcePather();
    test('html', ()=> {
        assert.doesNotThrow( () => {
            rp.html = '';
        });
    });
});