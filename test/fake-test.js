/* global describe, it */
'use strict';
var assert = require('chai').assert,
  func = require('../helpers/fake-helper.js')
;
describe('the ezmaster application', function () {

  it('should be able to run a fake test', function() {
    assert.equal(func('Yo'), 'Yo!');
  });

});
