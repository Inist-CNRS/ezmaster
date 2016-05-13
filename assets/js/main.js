/* global $, document, JSONEditor, nColumns, view */

var Vue = require('vue');

Vue.config.delimiters = ['[[', ']]'];
Vue.use(require('vue-resource'));

require('components/addInstance');
require('components/table');
