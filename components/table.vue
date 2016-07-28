
<!--
  This is a .vue component divided into 3 parts :
  - <template> containing the HTML code of this component.
  - <script> containing the javascript code of this component.
  - <style> containing the CSS code of this component.
 -->

<template>

  <table id="instances-table" class="table table-striped">
    <thead>
      <tr>
        <th>Long Name</th>
        <th>Technical Name</th>
        <th>Creation Date</th>
        <th>Application</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in containers">
        <tr v-if="[[ item.running ]] == 'true'" class="success" id="[[ item.containerId ]]">
          <td>[[ item.longName ]]</td>
          <td>[[ item.technicalName ]]</td>
          <td>[[ item.creationDate ]]</td>
          <td>[[ item.app ]]</td>
          <td> <span>Started</span> </td>
          <td class="actions">
            <ul class="bread" style="margin-bottom:0px">
              <li class="start" title="Start the instance"><button type='button' class="btn btn-raised btn-sm btn-success button" disabled>Start</button></li>
              <li class="stop" title="Stop the instance"><button type='button' class="btn btn-raised btn-sm btn-danger button" v-on:click="stopInstance">Stop</button></li>
              <li class="delete" title="Delete the instance"><button type='button' class="btn btn-raised btn-sm btn-warning button" v-on:click="deleteInstance">Delete</button></li>
              <li class="updateConfig" title="Updating configuration of the instance"><button type='button' id='displayConfig' class="btn btn-raised btn-sm btn-info button" v-on:click="displayConfig">Config </button></li>
              <li class="openPublicLink" title="Open the instance"><a class="btn btn-raised btn-sm btn-link button" target="[[ item.target ]]" class="publicLink" href='[[ item.publicURL ]]'>Access</a></li>
              <li v-if="[[ publicDomain ]] != ''" class="openPublicLink" title="Open the instance"><a class="btn btn-raised btn-sm btn-link button"  target="[[ item.target ]].[[ publicDomain ]]" class="publicLink" href='http://[[ item.target ]].[[ publicDomain ]]'>Public Access </a></li>
            </ul>

            <div class="modal" id="modal-delete-instance">
              <div class="modal-dialog">
                <div class="modal-content">
                   <div class="panel panel-warning">
                    <div class="panel-heading">
                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelDeleteInstance">×</button>
                      <h3 class="panel-title">Delete Instance</h3>
                    </div>
                    <div class="panel-body">
                      <p>
                        <span class="deleteConfirmationMessage">You will delete the <span class="text-warning">[[ technicalNameToDelete ]]</span> instance.</span><br /><br />
                        <span class="deleteSizeFolder">It represents <span class="text-warning">[[ sizeToDelete ]]</span> of data.</span>
                      </p><br />
                    </div>
                    <div class="panel-footer">
                      <a class="btn btn-default" v-on:click='cancelDeleteInstance' data-dismiss="modal">Cancel</a>
                      <a style='float:right' class="btn btn-warning" v-on:click="confirmDeleteInstance">Delete</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal" id="modal-update-config">
              <div class="modal-dialog">
                <div class="modal-content">
                   <div class="panel panel-info">
                    <div class="panel-heading">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelConfig">×</button>
                      <h3 class="panel-title">Configuration Update</h3>
                    </div>
                    <div class="panel-body">
                      <div id="jsoneditor"></div>
                      <span id='spanConfigError' class='text-danger'></span>
                    </div>
                    <div class="panel-footer">
                      <a class="btn btn-default" v-on:click='cancelConfig' data-dismiss="modal">Cancel</a>
                      <a style='float:right' id='buttonUpdate' class="btn btn-info" v-on:click="updateConfig">Update</a>
                      <a style='float:right; display:none' id='buttonUpdateDisable' class="btn btn-info" disabled>Update</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>

        <tr v-else class="danger" id="[[ item.containerId ]]">
          <td>[[ item.longName ]]</td>
          <td>[[ item.technicalName ]]</td>
          <td>[[ item.creationDate ]]</td>
          <td>[[ item.app ]]</td>
          <td><span v-else>Stopped</span></td>
          <td class="actions">
            <ul class="bread" style="margin-bottom:0px">
              <li class="start" title="Start the instance"><button type='button' class="btn btn-raised btn-sm btn-success button" v-on:click="startInstance">Start</button></li>
              <li class="stop" title="Stop the instance"><button type='button' class="btn btn-raised btn-sm btn-danger button" disabled>Stop</button></li>
              <li class="delete" title="Delete the instance"><button type='button' class="btn btn-raised btn-sm btn-warning button" v-on:click="deleteInstance">Delete</button></li>
              <li class="updateConfig" title="Updating configuration of the instance"><button type='button' id='displayConfig' class="btn btn-raised btn-sm btn-info button" v-on:click="displayConfig">Config</button></li>
              <li class="openPublicLink" title="Open the instance"><button type="button" class="btn btn-raised btn-sm btn-link button" disabled>Access</button></li>
              <li v-if="[[ publicDomain ]] != ''" class="openPublicLink" title="Open the instance"><button type="button" class="btn btn-raised btn-sm btn-link button" disabled>Public Access</button></li>
            </ul>

            <div class="modal" id="modal-delete-instance">
              <div class="modal-dialog">
                <div class="modal-content">
                   <div class="panel panel-warning">
                    <div class="panel-heading">
                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelDeleteInstance">×</button>
                      <h3 class="panel-title">Delete Instance</h3>
                    </div>
                    <div class="panel-body">
                      <p>
                        <span class="deleteConfirmationMessage">You will delete the <span class="text-warning">[[ technicalNameToDelete ]]</span> instance.</span><br /><br />
                        <span class="deleteSizeFolder">It represents <span class="text-warning">[[ sizeToDelete ]]</span> of data.</span>
                      </p><br />
                    </div>
                    <div class="panel-footer">
                      <a class="btn btn-default" v-on:click='cancelDeleteInstance' data-dismiss="modal">Cancel</a>
                      <a style='float:right' class="btn btn-warning" v-on:click="confirmDeleteInstance">Delete</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal" id="modal-update-config">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="panel panel-info">
                    <div class="panel-heading">
                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelConfig">×</button>
                      <h3 class="panel-title">Configuration Update</h3>
                    </div>
                    <div class="panel-body">
                      <div id="jsoneditor"></div>
                      <span id='spanConfigError' class='text-danger'></span>
                    </div>
                    <div class="panel-footer">
                      <a class="btn btn-default" v-on:click='cancelConfig' data-dismiss="modal">Cancel</a>
                      <a style='float:right' id='buttonUpdate' class="btn btn-info" v-on:click="updateConfig">Update</a>
                      <a style='float:right; display:none' id='buttonUpdateDisable' class="btn btn-info" disabled>Update</a>
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
      self.$http.get('/-/v1/instances').then(function (result) {
        self.$set('containers', result.data);
      }, console.error);

      self.$http.get('/-/v3/config.js').then(function (result) {
        var config = JSON.parse(result.data);
        self.$set('publicDomain', config.publicDomain);
      }, console.error);

      // Listen incoming messages typed as 'refreshInstances' from the server.
      // Here the message comes from eventRefreshInstances.js.
      socket.on('refreshInstances', function(beatInstances) {
        // Update variable 'containers' which will automatically
        // refresh the instances-table component.
        self.$set('containers', beatInstances);


        console.log("########## SOCKET ##########");

        console.log(beatInstances);


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

        console.debug("########## TABLE.VUE START ##########");

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

      deleteInstance : function (event) {
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