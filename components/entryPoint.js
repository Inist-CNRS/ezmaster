
'use strict';

var Vue = require('vue');
var Icon = require('vue-awesome/dist/vue-awesome');

Vue.component('icon', Icon);
Vue.component('modal', require('vue-strap/dist/vue-strap.min').modal)
Vue.component('alert', require('vue-strap/dist/vue-strap.min').alert)


Vue.filter('uri', function (input) {
  return String(input).replace(window.location.origin, '');
})


Vue.use(require('vue-resource'));
Vue.use(require('vue-infinite-scroll'));


module.exports = new Vue({
  el: 'body',
  components: {
    App : require('./Factice.vue')
  }
})