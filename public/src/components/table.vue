
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
              <li v-show="!item.running" class="start" :title="'Start ' + item.technicalName"><span class="glyphicon glyphicon-play action" v-on:click="startInstance(item.containerId)"></span></li>
              <li v-show="item.running" class="stop" :title="'Stop ' + item.technicalName"><span class="glyphicon glyphicon-stop action" v-on:click="stopInstance(item.containerId)"></span></li>

              <li class="delete" :title="'Delete ' + item.technicalName"><button type='button' class="btn btn-raised btn-sm btn-warning button" v-on:click="deleteInstance(item.containerId)">Delete</button></li>
              <li class="updateConfig" :title="'Edit settings of ' + item.technicalName"><button type='button' class="btn btn-raised btn-sm btn-info button" v-on:click="displayConfig(item.containerId)">Config </button></li>
              <li v-show="item.dataPath" class="updateData" :title="'Upload data to ' + item.technicalName"><button type='button' class="btn btn-raised btn-sm btn-info button" v-on:click="displayFiles(item.containerId)">Data</button></li>
              <li class="openPublicLink" :title="'Open ' + item.technicalName"><a class="btn btn-raised btn-sm btn-link button publicLink" :target="item.target" :href="item.publicURL" v-bind:disabled="!item.running">Access</a></li>
              <li v-if="publicDomain != ''" class="openPublicLink" :title="'Open ' + item.technicalName + ' using its public URL'"><a class="btn btn-raised btn-sm btn-link button publicLink"  :target="item.target[publicDomain]" :href="'http://' + item.target + '.' + publicDomain">Public Access </a></li>
              <li><a :href="'/-/v1/instances/' + item.technicalName + '/logs'" target="_blank" :title="'See the logs of ' + item.technicalName"><span class="glyphicon glyphicon-file" aria-hidden="true"></span></a></li>
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


  <Config v-if="showConfig" v-on:close="closeConfig" :instanceId="instanceId"></Config>
  <FileManagement v-if="showFiles" v-on:close="closeFiles" :instanceId="instanceId"></FileManagement>

</div>
</template>


<script>
  import FileManagement from './file-management.vue';
  import Config from './instance-config.vue';
  import Store from './store.js';

  export default {
    data () {
      return {
        Store,
        showFiles: false,
        showConfig: false,
        sizeToDelete: '',
        technicalNameToDelete: '',
        containers: [],
        publicDomain: '',
        instanceId: ''
      };
    },
    components: {
      FileManagement,
      Config
    },
    mounted () {
      // Call the route /-/v1/instances with a get wich get the instances list.
      // Store the instances list into the variable containers used into the HTML with v-for.
      this.$http.get('/-/v1/instances').then(result => {
        this.containers = result.data;
      }, console.error);

      this.$http.get('/-/v1/config').then(result => {
        var config = result.data;
        this.publicDomain = config.publicDomain;
      }, console.error);

      // Listen incoming messages typed as 'refreshInstances' from the server.
      // Here the message comes from eventRefreshInstances.js.
      this.Store.socket.on('refreshInstances', beatInstances => {
        // Update variable 'containers' which will automatically
        // refresh the instances-table component.
        this.containers = beatInstances;
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
        this.showConfig = true;
        this.instanceId = instanceId;
      },
      closeConfig: function () {
        this.showConfig = false;
      },

      displayFiles: function (instanceId) {
        // Shows the modal upload and reset the inputs.
        this.showFiles = true;
        this.instanceId = instanceId;
      },

      closeFiles: function () {
        this.showFiles = false;
      }

    } // End of Methods
  };

</script>



<style>
  .action {
    cursor: pointer;
  }
  .glyphicon-play.action {
    color: green;
  }
  .glyphicon-stop.action {
    color: red;
  }
  #instances-table {
    width: 95%;
    margin: auto;
    margin-bottom: 2%;
    margin-top: 5%;
  }
</style>
