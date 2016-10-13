/*eslint no-unused-vars: 0*/
'use strict';

import Vue from 'vue';

Vue.config.delimiters = ['[[', ']]'];

Vue.use(require('vue-validator'));
Vue.use(require('vue-resource'));


Vue.validator('numeric', function (val) {
  return /^[0-9]+$/.test(val);
});

Vue.validator('lowercaseAndDigits', function (val) {
  return /^[a-z0-9]+$/.test(val);
});


var vueInfosMachineTable = require('./components/infos-machine-table.vue');
var vueTable             = require('./components/table.vue');
var vueAddInstance       = require('./components/add-instance.vue');
var vueaddApps           = require('./components/add-apps.vue');
var vueApps              = require('./components/apps.vue');

module.exports = new Vue({

  el: 'body',

  components: {

    // The left key corresponds to the html tag where the component is included.
    // For exemple, we put the table.vue component
    // into <instancestable></instancestable> in template.html.
    infosmachine : vueInfosMachineTable,
    instancestable : vueTable,
    addinstance : vueAddInstance,
    apps : vueApps,
    addapps : vueaddApps
  }

});