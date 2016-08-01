<template>
  <table id="applications-table" class="table table-striped">
    <thead>
      <tr>
        <th>Image</th>
        <th>Creation Date</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in containers">
        <tr class="success" id="[[ item.containerId ]]">
          <td>[[ item.imageName ]]</td>
          <td>[[ item.creationDate ]]</td>
          <td> <span>Started</span> </td>
          <td class="actions">
            <ul class="bread" style="margin-bottom:0px">
              <li class="delete" title="Delete the application"><button type='button' class="btn btn-raised btn-sm btn-warning button" v-on:click="deleteapplication">Delete</button></li>
            </ul>

            <div class="modal" id="modal-delete-application">
              <div class="modal-dialog">
                <div class="modal-content">
                   <div class="panel panel-warning">
                    <div class="panel-heading">
                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelDeleteapplication">×</button>
                      <h3 class="panel-title">Delete application</h3>
                    </div>
                    <div class="panel-body">
                      <p>
                        <span class="deleteConfirmationMessage">You will delete the <span class="text-warning">[[ technicalNameToDelete ]]</span> application.</span><br /><br />
                        <span class="deleteSizeFolder">It represents <span class="text-warning">[[ sizeToDelete ]]</span> of data.</span>
                      </p><br />
                    </div>
                    <div class="panel-footer">
                      <a class="btn btn-default" v-on:click='cancelDeleteapplication' data-dismiss="modal">Cancel</a>
                      <a style='float:right' class="btn btn-warning" v-on:click="confirmDeleteapplication">Delete</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>

/* global Vue, global document, global JSONEditor, global io*/

  // Socket connection.
  var socket = io();

  var optsEditor = {}
    , editor = new JSONEditor()
    , idToDelete = null
    , idToConfig = null
    ;


  export default {

    ready () {

      let self = this;

      // ... call the route /-/v1/instances with a get wich get the instances list.
      // Store the instances list into the variable containers used into the HTML with v-for.
      self.$http.get('/-/v1/app').then(function (result) {
        self.$set('containers', result.data);
      }, console.error);

      // Listen incoming messages typed as 'refreshInstances' from the server.
      // Here the message comes from eventRefreshInstances.js.
      socket.on('refreshInstances', function(beatInstances) {
        // Update variable 'containers' which will automatically
        // refresh the instances-table component.
        self.$set('containers', beatInstances);


      });

    },


    methods: {

      refresh : function () {
        this.$http.get('/-/v1/apps').then(function (result) {
          this.$set('containers', result.data);
        }, console.error);
      },


      deleteInstance : function (event) {
        var data = {
          action : 'info'
        };
        idToDelete = event.path[4].id;
        this.$http.get('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
          var res = JSON.parse(result.data);
          this.technicalNameToDelete = res.technicalName;
          this.sizeToDelete = res.size;
          document.getElementById('modal-delete-instance').style.display = 'block';

        }, console.error);
      },

      cancelDeleteInstance : function (event) {
        document.getElementById('modal-delete-instance').style.display = 'none';
      },

      confirmDeleteInstance : function (event) {
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
        this.$http.get('/-/v1/instances/'+event.path[4].id).then(function (result) {
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


    data () {
      return {
        sizeToDelete : '',
        technicalNameToDelete : '',
        containers : [],
        publicDomain : ''
      }
    }

  }
</script>

<style>
#instances-table {
      width: 95%;
      margin: auto;
      margin-bottom: 2%;
      margin-top: 5%;
  }

  .bread {
    list-style: none;
    padding-left: 0px;
  }

  .bread > li {
    display: inline-block;
    margin-right: 3%;
  }

  .actions {
    padding: 6px !important;
  }

  .button {
    margin: 0 !important;
  }

  #jsoneditor {
    width: 100%;
    height: 450px;
  }
</style>