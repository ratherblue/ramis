var expect = require('chai').expect;
var index = require('../src/index');

describe('main', function() {
    it('should pass', function() {
        expect(index.init()).to.equal(false);
    });
});
