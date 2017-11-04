// http://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build

import Vue         from 'vue/dist/vue.js';
import VeeValidate from 'vee-validate';
import App         from './components/app.vue';

VeeValidate.Validator.extend('lowercase', {
  getMessage: field => `The ${field} is not lowercase.`,
  validate: value => value.toLowerCase() === value
});

Vue.use(require('vue-resource'));
Vue.use(VeeValidate);


module.exports = new Vue({

  el: '#content',

  components: {
    App
  }

});
