/* global Vue, $, location */
'use strict';

var optsEditor = {}
  , editor = new JSONEditor()
  , idToDelete = null
  , idToConfig = null
  , heartbeats = require('heartbeats');

var vm = new Vue({
  el: '#instances-table',
  ready : function () {
    var self = this;
    self.$http.get('/-/v1/instances').then(function (result) {
      self.$set('containers', result.data);
    }, console.error);

    function verifRefresh() {
      if (document.getElementById('modal-delete-instance').style.display != 'block' && 
          document.getElementById('modal-update-config').style.display != 'block') {
        return true;
      }
      else { return false; }
    }

    var heart_1 = heartbeats.createHeart(1000);
    heart_1.createEvent(1, {repeat : 30}, function(heartbeat, last){
      if (verifRefresh()) { refresh(); }
      if (last == true) {
        var heart_2 = heartbeats.createHeart(60000);
        heart_2.createEvent(1, function (heartbeat, last) {
          if (verifRefresh()) { refresh(); }
        });
      }
    });
  },
  methods: {
    startInstance : function (event) {
      var data = {
        action : 'start'
      };
      this.$http.put('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
        refresh();
      }, console.error);
    },

    stopInstance : function (event) {
      var data = {
        action : 'stop'
      };
      this.$http.put('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
        refresh();
      }, console.error);
    },

    confirmationDelete : function (event) {
      var data = {
        action : 'info'
      }
      idToDelete = event.path[4].id;
      this.$http.get('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
        this.technicalNameToDelete = result.data.technicalName;
        this.sizeToDelete = result.data.size;
        document.getElementById('modal-delete-instance').style.display = 'block';
      }, console.error);
    },

    cancelDelete : function (event) {
      document.getElementById('modal-delete-instance').style.display = 'none';
    },

    deleteInstance : function (event) {
      this.$http.delete('/-/v1/instances/'+idToDelete).then(function (result) {
        refresh();
      }, console.error);
    },

    cancelConfig : function (event) {
      refresh();
    },

    displayConfig : function (event) {
      var data = {
        action : 'config'
      }
      idToConfig = event.path[4].id;
      this.$http.get('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
        document.getElementById('modal-update-config').style.display = 'block';
        optsEditor = { 
          modes: ['tree', 'view', 'code'],
          onChange : function() {
            try {
              editor.get();
              document.getElementById('spanConfigError').style.display = "none";
              document.getElementById('buttonUpdateDisable').style.display = 'none';
              document.getElementById('buttonUpdate').style.display = 'block';
            }
            catch (e) {
              document.getElementById('spanConfigError').innerHTML = e;
              document.getElementById('buttonUpdate').style.display = 'none';
              document.getElementById('buttonUpdateDisable').style.display = 'block';
              document.getElementById('spanConfigError').style.display = "block";
            }
          }
        };
        editor = new JSONEditor(document.getElementById('jsoneditor'), optsEditor);
        editor.set(result.data);
      });
    },

    updateConfig : function (event) {
      var newConfig = editor.get();

      var data = {
        action : 'updateConfig'
        , newConfig : newConfig
        , newTitle : newConfig.title
      };
      this.$http.put('/-/v1/instances/'+idToConfig, data).then(function (result) {
        refresh();
      });
    }
  },
  data : {
    sizeToDelete : '',
    technicalNameToDelete : '',
    containers : []
  }
});

module.exports = vm;

function refresh () {
  vm.$http.get('/-/v1/instances').then(function (result) {
    vm.$set('containers', result.data);
  }, console.error);
}