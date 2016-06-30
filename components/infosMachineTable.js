
'use strict';

// View for the machine infos table in HTML which id is infosMachineTable.
var vmTableInfosMachine = new Vue({

  el: '#infosMachineTable',

  ready : function () {   // When the table is ready...

    var self = this;
    var infosMachine = {};

    // Give the just created infosMachine object to the infosMachine variable used in template.html.
    self.$set('infosMachine', infosMachine);

  },

// Not used.
  methods: {

    exampleMethod : function (event) {
      var data = {
        action : 'start'
      };

      this.$http.put('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
        refresh();
      }, console.error);
    },

  },

// Not used.
  data : {
    truc1 : '',
    truc2 : '',
    truc3 : []
  }


});

module.exports = vmTableInfosMachine;