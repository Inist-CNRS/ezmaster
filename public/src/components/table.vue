
<!--
  This is a .vue component divided into 3 parts :
  - <template> containing the HTML code of this component.
  - <script> containing the javascript code of this component.
  - <style> containing the CSS code of this component.
 -->

<template>
<div>
  <table id="instances-table" class="table table-striped table-hover">
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

        <tr>
          <td>{{ item.longName }}</td>
          <td>{{ item.technicalName }}</td>
          <td>{{ item.creationDate }}</td>
          <td>{{ item.app }}</td>
          <td>
            <span class="label label-success" v-if="item.running">Running</span>
            <span class="label label-danger" v-else>Stopped</span>
          </td>
          <td class="actions">
            <ul class="bread">
              <li class="start" title="Start the instance."><button type='button' class="btn btn-raised btn-sm btn-success button" v-bind:disabled="item.running" v-on:click="startInstance(item.containerId)">Start</button></li>
              <li class="stop" title="Stop the instance."><button type='button' class="btn btn-raised btn-sm btn-danger button" v-bind:disabled="!item.running" v-on:click="stopInstance(item.containerId)">Stop</button></li>
              <li class="delete" title="Delete the instance."><button type='button' class="btn btn-raised btn-sm btn-warning button" v-on:click="deleteInstance(item.containerId)">Delete</button></li>
              <li class="updateConfig" title="Update the instance configuration."><button type='button' class="btn btn-raised btn-sm btn-info button" v-on:click="displayConfig(item.containerId)">Config </button></li>
              <li v-show="item.dataPath" class="updateData" title="Upload data for the instance."><button type='button' class="btn btn-raised btn-sm btn-info button" v-on:click="displayFiles(item.containerId)">Data</button></li>
              <li class="openPublicLink" title="Open the instance."><a class="btn btn-raised btn-sm btn-link button publicLink" :target="item.target" :href="item.publicURL" v-bind:disabled="!item.running">Access</a></li>
              <li v-if="publicDomain != ''" class="openPublicLink" title="Open the instance."><a class="btn btn-raised btn-sm btn-link button publicLink"  :target="item.target[publicDomain]" :href="'http://' + item.target + '.' + publicDomain">Public Access </a></li>
              <li><a :href="'/-/v1/instances/' + item.technicalName + '/logs'" target="blank"><span class="glyphicon glyphicon-file" aria-hidden="true"></span></a></li>
            </ul>
          </td>
        </tr>

      </template>

    </tbody>

  </table>

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
              <span class="deleteConfirmationMessage">You will delete the <span class="text-warning">{{ technicalNameToDelete }}</span> instance.</span><br /><br />
              <span class="deleteSizeFolder">It represents <span class="text-warning">{{ sizeToDelete }}</span> of data.</span>
            </p><br />
          </div>
          <div class="panel-footer">
            <a class="btn btn-default" v-on:click='cancelDeleteInstance' data-dismiss="modal">Cancel</a>
            <a class="btn btn-warning button-right" v-on:click="confirmDeleteInstance">Delete</a>
          </div>
        </div>
      </div>
    </div>
  </div>


  <div class="modal" v-bind:class="{ 'modal-fullscreen': fullscreen }" id="modal-update-config">
    <div class="modal-dialog">
      <div class="modal-content">
         <div class="panel panel-info">
          <div class="panel-heading">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelConfig">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </button>
            <button type="button" class="fs-button close" aria-hidden="true" v-on:click="fullscreenConfig">
              <span class="glyphicon" v-bind:class="{ 'glyphicon-resize-small': fullscreen, 'glyphicon-resize-full': !fullscreen }" aria-hidden="true"></span>
            </button>
            <h3 class="panel-title">Configuration Update</h3>
          </div>
          <div class="panel-body">
            <div id="jsoneditor"></div>
            <span id="spanConfigError" class="text-danger"></span>
          </div>
          <div class="panel-footer">
            <a class="btn btn-default" v-on:click="cancelConfig" data-dismiss="modal">Cancel</a>
            <a id="buttonUpdate" class="btn btn-info button-right" v-on:click="updateConfig">Update</a>
            <a id="buttonUpdateDisable" class="btn btn-info button-update" disabled>Update</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <FileManagement v-if="showFiles" v-on:close="closeFiles" :instanceId="instanceId"></FileManagement>

</div>
</template>



<script>
  /* global JSONEditor, io*/
  // Socket connection.

  var socket = io();
  var optsEditor = {};
  var editor = new JSONEditor();

  import FileManagement from './file-management.vue';

  export default {

    mounted () {
      const self = this;

      // Call the route /-/v1/instances with a get wich get the instances list.
      // Store the instances list into the variable containers used into the HTML with v-for.
      self.$http.get('/-/v1/instances').then(function (result) {
        self.containers = result.data;
      }, console.error);

      self.$http.get('/-/v1/config').then(function (result) {
        var config = result.data;
        self.publicDomain = config.publicDomain;
      }, console.error);

      // Listen incoming messages typed as 'refreshInstances' from the server.
      // Here the message comes from eventRefreshInstances.js.
      socket.on('refreshInstances', function (beatInstances) {
        // Update variable 'containers' which will automatically
        // refresh the instances-table component.
        self.containers = beatInstances;
      });
    },

    methods: {

      startInstance: function (instanceId) {
        // event.path[4].id go up 4 times in the HTML tree to get the id of the reached element.
        // Here, the instance id.
        // button start > li > ul > td > tr > id="{{ item.description.Id }}"
        this.$http.put(`/-/v1/instances/start/${instanceId}`).then(function (result) {
        }, console.error);
      },

      stopInstance: function (instanceId) {
        this.$http.put(`/-/v1/instances/stop/${instanceId}`).then(function (result) {
        }, console.error);
      },

      deleteInstance: function (instanceId) {
        // Update the data variable instanceId which will automatically update the HTML
        //  with this new value.
        this.instanceId = instanceId;

        this.$http.get(`/-/v1/instances/${instanceId}`).then(function (result) {
          this.technicalNameToDelete = result.data.technicalName;
          this.sizeToDelete = result.data.size;

          document.getElementById('modal-delete-instance').style.display = 'block';
        }, console.error);
      },

      cancelDeleteInstance: function () {
        document.getElementById('modal-delete-instance').style.display = 'none';
      },

      confirmDeleteInstance: function () {
        this.$http.delete('/-/v1/instances/' + this.instanceId).then(function (result) {
          document.getElementById('modal-delete-instance').style.display = 'none';
        }, console.error);
      },

      displayConfig: function (instanceId) {
        document.getElementById('jsoneditor').innerHTML = '';

        // Update the data variable instanceId which will automatically update the HTML
        //  with this new value.
        this.instanceId = instanceId;

        this.$http.get(`/-/v1/instances/${this.instanceId}`).then(function (result) {
          document.getElementById('modal-update-config').style.display = 'block';

          optsEditor = {

            mode: 'code',
            onChange: function () {
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
          editor.set(result.data.config);
        });
      },

      cancelConfig: function () {
        document.getElementById('modal-update-config').style.display = 'none';
      },

      fullscreenConfig: function () {
        this.fullscreen = !this.fullscreen;
      },

      updateConfig: function () {
        var newConfig = editor.get();
        var data = {
          newConfig: newConfig,
          newTitle: newConfig.title
        };
        this.$http.put('/-/v1/instances/config/' + this.instanceId, data).then(function (result) {
          document.getElementById('modal-update-config').style.display = 'none';
        });
      },

      displayFiles: function (instanceId) {
        // Shows the modal upload and reset the inputs.
        this.showFiles = true;
        this.instanceId = instanceId;
      },

      closeFiles: function () {
        this.showFiles = false;
      }

    }, // End of Methods

    data () {
      return {
        showFiles: false,
        sizeToDelete: '',
        technicalNameToDelete: '',
        containers: [],
        publicDomain: '',
        instanceId: '',
        fullscreen: false
      };
    },
    components: {
      FileManagement
    }
  };

</script>



<style>

  #instances-table {
    width: 95%;
    margin: auto;
    margin-bottom: 2%;
    margin-top: 5%;
  }
  /*.bread {
    list-style: none;
    padding-left: 0px;
    margin-bottom:0px;
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

  .modal-dialog {
    overflow-y: initial !important
  }

  .button-right {
    float:right;
  }

  .button-update {
    float:right;
    display:none;
  }

  .fs-button {
    margin-right: 10px;
  }*/
  .modal-fullscreen .modal-dialog {
    margin: 0;
    margin-right: auto;
    margin-left: auto;
    width: 100%;
    max-width: 1024;
  }
  .modal-fullscreen .panel-footer {
    padding: 0;
  }
  .modal-fullscreen .panel-body {
    padding: 0;
  }
  .modal-fullscreen #jsoneditor {
    height: calc(100vh - 100px);
  }
</style>
