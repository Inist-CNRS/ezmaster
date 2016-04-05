'use strict';

module.exports = function(options) {
  options = options || {};
  return function (input, submit) {
    input.content.fake = 'Fake Loader';
    submit(null, input);
  };
};

