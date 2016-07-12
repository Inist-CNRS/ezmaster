
/* global Vue, global document, global JSONEditor, global io*/

'use strict';

// Socket connection.
var socket = io();

var optsEditor = {}
  , editor = new JSONEditor()
  , idToDelete = null
  , idToConfig = null


// view for the instances table in HTML which id is instances-table.
var vmTableInstances = new Vue({

  el: '#instances-table',

  ready : function () {   // When the table is ready...

    // ... call the route /-/v1/instances with a get wich get the instances list.
    // Store the instances list into the variable containers used into the HTML with v-for.
    var self = this;
    self.$http.get('/-/v1/instances').then(function (result) {
      self.$set('containers', result.data);
    }, console.error);


    self.$http.get('/-/v3/config.js').then(function (result) {
      self.$set('publicDomain', result.data.publicDomain);
    }, console.error);


    // Listen incoming messages typed as 'refreshInstances' from the server.
    // Here the message comes from eventRefreshInstances.js.
    socket.on('refreshInstances', function(beatInstances) {
      // Update variable 'containers' which will automatically refresh the instances-table component.
      vmTableInstances.$set('containers', beatInstances);
    });

  },


  methods: {

    refresh : function () {
      this.$http.get('/-/v1/instances').then(function (result) {
        this.$set('containers', result.data);
      }, console.error);
    },

    startInstance : function (event) {
      var data = {
        action : 'start'
      };

      this.$http.put('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
        this.refresh();
      }, console.error);
      // event.path[4].id go up 4 times in the HTML tree to get the id of the reached element.
      // Here, the instance id.
      // button start > li > ul > td > tr > id="[[ item.description.Id ]]"
    },

    stopInstance : function (event) {
      var data = {
        action : 'stop'
      };

      this.$http.put('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
        this.refresh();
      }, console.error);
    },

    confirmationDelete : function (event) {
      var data = {
        action : 'info'
      };
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
        document.getElementById('modal-delete-instance').style.display = 'none';
        this.refresh();
      }, console.error);
    },

    cancelConfig : function (event) {
      document.getElementById('modal-update-config').style.display = 'none';
    },

    displayConfig : function (event) {
      var data = {
        action : 'config'
      };

      document.getElementById('jsoneditor').innerHTML = '';

      idToConfig = event.path[4].id;
      this.$http.get('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
        document.getElementById('modal-update-config').style.display = 'block';
        optsEditor = {
          mode: 'code',
          onChange : function() {
            try {
              editor.get();
              document.getElementById('spanConfigError').style.display = 'none';
              document.getElementById('buttonUpdateDisable').style.display = 'none';
              document.getElementById('buttonUpdate').style.display = 'block';
            }
            catch (e) {
              document.getElementById('spanConfigError').innerHTML = e;
              document.getElementById('buttonUpdate').style.display = 'none';
              document.getElementById('buttonUpdateDisable').style.display = 'block';
              document.getElementById('spanConfigError').style.display = 'block';
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
        document.getElementById('modal-update-config').style.display = 'none';
      });
    }

  },

  data : {
    sizeToDelete : '',
    technicalNameToDelete : '',
    containers : []
  }

});


module.exports = vmTableInstances;