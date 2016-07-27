
// The entryPoint calls the project components.

/* global Vue */

'use strict';

var vueInfosMachineTable = require('./infosMachineTable.vue');
var vueTable = require('./table.vue');
var vueAddInstance = require('./addInstance.vue');

module.exports = new Vue({

  el: 'body',

  components: {

    // The left key corresponds to the html tag where the component is included.
    // For exemple, we put the table.vue component
    // into <instancestable></instancestable> in template.html.
    infosmachine : vueInfosMachineTable,
    instancestable : vueTable,
    addinstance : vueAddInstance

  }

});