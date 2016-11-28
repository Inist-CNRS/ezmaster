/*eslint no-unused-vars: 0*/
'use strict';

// http://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build
const Vue = require('vue/dist/vue.js');
const VeeValidate = require('vee-validate');

VeeValidate.Validator.extend('lowercase', {
  getMessage: field => `The ${field} is not lowercase.`,
  validate: value => value.toLowerCase() === value
});

Vue.use(require('vue-resource'));
Vue.use(VeeValidate);

const vueInfosMachineTable = require('./components/infos-machine-table.vue');
const vueTable             = require('./components/table.vue');
const vueAddInstance       = require('./components/add-instance.vue');
const vueaddApps           = require('./components/add-apps.vue');
const vueApps              = require('./components/apps.vue');

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