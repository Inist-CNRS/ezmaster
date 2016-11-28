/*eslint no-unused-vars: 0*/
'use strict';

// http://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build
var Vue = require('vue/dist/vue.js')

Vue.use(require('vue-resource'));

var vueInfosMachineTable = require('./components/infos-machine-table.vue');
var vueTable             = require('./components/table.vue');
var vueAddInstance       = require('./components/add-instance.vue');
var vueaddApps           = require('./components/add-apps.vue');
var vueApps              = require('./components/apps.vue');

module.exports = new Vue({

  el: '#content',

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