/* global Vue, $ */
'use strict';

module.exports = new Vue({
  el: '.bread',
  data : {
    sizeToDelete : '',
    titleToDelete : ''
  },
  methods: {
    startInstance : function (event) {
      var data = {
        action : 'start'
      };
      this.$http.put('/-/v1/instances/'+event.path[2].id, data).then(function (result) {
        $('#exited').hide();
        $('#running').show();
      }, console.error);
    },

    stopInstance : function (event) {
      var data = {
        action : 'stop'
      };
      this.$http.put('/-/v1/instances/'+event.path[2].id, data).then(function (result) {
        $('#running').hide();
        $('#exited').show();
      });
    },

    confirmationDelete : function (event) {
      this.$http.get('/-/v1/instances/'+event.path[2].id).then(function (result) {
        this.titleToDelete = result.data.title;
        this.sizeToDelete = result.data.size;
        $('#modal-delete-instance').show();
      });
    },

    cancelDelete : function (event) {
      $('#modal-delete-instance').hide();
    },

    deleteInstance : function (event) {
      this.$http.delete('/-/v1/instances/'+event.path[5].id).then(function (result) {
        $('#modal-delete-instance').hide();
      });
    }
  }
});
