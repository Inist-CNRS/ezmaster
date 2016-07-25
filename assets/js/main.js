/*eslint no-unused-vars: 0*/
'use strict';

var Vue = require('vue');

Vue.config.delimiters = ['[[', ']]'];

Vue.use(require('vue-validator'));
Vue.use(require('vue-resource'));


Vue.validator('numeric', function (val) {
  return /^[0-9]+$/.test(val);
});
Vue.validator('lowercaseAndDigits', function (val) {
  return /^[a-z0-9]+$/.test(val);
});

require('components/addInstance');
var vmTableInstances = require('components/table');
//var vmTableInfosMachine = require('components/infosMachineTable');

require('components/entryPoint');