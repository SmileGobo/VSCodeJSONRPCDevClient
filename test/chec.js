assert = require('assert');

suite('check', () => {
    test('simple test lib check', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
    });
});