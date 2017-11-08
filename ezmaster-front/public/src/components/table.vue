
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
          <td>
            <span v-show="!item.running">{{ item.technicalName }}</span>
            <a v-show="item.running && !publicDomain && item.publicURL" :href="item.publicURL" :target="item.target">{{ item.technicalName }}</a>
            <a v-show="item.running && publicDomain" :href="'http://' + item.target + '.' + publicDomain" :target="item.target">{{ item.technicalName }}</a>
          </td>
          <td>{{ item.creationDate }}</td>
          <td>{{ item.app }}</td>
          <td>
            <span class="label label-success" v-if="item.running">Running</span>
            <span class="label label-danger" v-else>Stopped</span>
          </td>
          <td class="actions">
            <ul class="bread">
              <li v-show="!item.running" :title="'Start ' + item.technicalName"><span class="glyphicon glyphicon-play text-success action" v-on:click="startInstance(item.containerId)"></span></li>
              <li v-show="item.running" :title="'Stop ' + item.technicalName"><span class="glyphicon glyphicon-stop text-danger action" v-on:click="stopInstance(item.containerId)"></span></li>
              <li :title="'Delete ' + item.technicalName"><span class="glyphicon glyphicon-trash text-warning action" v-on:click="displayRemover(item)"></span></li>
              <li :title="'Edit settings of ' + item.technicalName"><span class="glyphicon glyphicon-cog text-primary action" v-on:click="displayConfig(item)"></span></li>
              <li v-show="item.dataPath" :title="'Upload data to ' + item.technicalName"><span class="glyphicon glyphicon-download-alt text-primary action" v-on:click="displayFiles(item)"></span></li>
              <li v-show="item.running" :title="'Open ' + item.technicalName"><a :target="item.target" :href="item.publicURL" v-bind:disabled="!item.running"><span class="glyphicon glyphicon-link"></span></a></li>
              <li v-show="publicDomain != '' && item.running" :title="'Open ' + item.technicalName + ' using its public URL'"><a :target="item.target && item.target[publicDomain]" :href="'http://' + item.target + '.' + publicDomain"><span class="glyphicon glyphicon-globe"></span></a></li>              
              <li><a :href="ezMasterAPI + '/-/v1/instances/' + item.technicalName + '/logs'" target="_blank" :title="'See the logs of ' + item.technicalName"><span class="glyphicon glyphicon-file"></span></a></li>
            </ul>
          </td>
        </tr>

      </template>

    </tbody>

  </table>

  <p class="refresh" v-show="refreshing">
    <i class="fa fa-refresh fa-spin fa-fw"></i> Refreshing...
  </p>

  <Remover v-on:instance-deleted="deleteInstance"></Remover>
  <Config></Config>
  <FileManagement></FileManagement>

</div>
</template>


<script>
  import FileManagement from './file-management.vue';
  import Config from './instance-config.vue';
  import Remover from './instance-remove.vue';
  import Store from './store.js';
  import eventHub from './event-hub.js';

  export default {
    data () {
      return {
        Store,
        showFiles: false,
        showConfig: false,
        showRemover: false,
        containers: [],
        publicDomain: '',
        selectedInstance: null
      };
    },
    components: {
      FileManagement,
      Config,
      Remover
    },
    mounted () {
      this.ezMasterAPI = this.Store.ezMasterAPI;

      this.refreshInstanceList();

      this.$http.get(this.Store.ezMasterAPI + '/-/v1/config').then(result => {
        var config = result.data;
        this.publicDomain = config.publicDomain;
      }, console.error);

      // if an instance status changes, update the interface
      this.Store.socket.on('docker-event', evt => {
        this.containers[evt.technicalName].running = (evt.status === 'start');

        if (evt.status === 'destroy') {
          this.$delete(this.containers, evt.technicalName);
        }
      });
    },

    methods: {
      refreshInstanceList () {
        this.refreshing = true;

        // Call the route http://localhost:35269/-/v1/instances with a get wich
        // get the instances list. Store the instances list into the variable
        // containers used into the HTML with v-for.
        this.$http.get(this.Store.ezMasterAPI + '/-/v1/instances').then(result => {
          this.containers = result.data;
          this.refreshing = false;
        }).catch(e => {
          console.error(e);
          this.refreshing = false;
        });
      },

      startInstance (instanceId) {
        // event.path[4].id go up 4 times in the HTML tree to get the id of the reached element.
        // Here, the instance id.
        // button start > li > ul > td > tr > id="{{ item.description.Id }}"
        this.$http.put(
          `${this.Store.ezMasterAPI}/-/v1/instances/start/${instanceId}`
        ).then(function (result) {
        }, console.error);
      },

      stopInstance (instanceId) {
        this.$http.put(
          `${this.Store.ezMasterAPI}/-/v1/instances/stop/${instanceId}`
        ).then(function (result) {
        }, console.error);
      },

      deleteInstance (technicalName) {
        this.$delete(this.containers, technicalName);
      },

      displayRemover (instance) {
        eventHub.$emit('openDeletePrompt', instance);
      },

      displayConfig (instance) {
        eventHub.$emit('openConfig', instance);
      },

      displayFiles (instance) {
        eventHub.$emit('openFileManagement', instance);
      }

    } // End of Methods
  };

</script>



<style>
  .action {
    cursor: pointer;
  }
  #instances-table {
    width: 95%;
    margin: auto;
    margin-bottom: 2%;
    margin-top: 5%;
  }
  .refresh {
    text-align: center;
  }
</style>
