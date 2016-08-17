
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
            <ul class="bread" id="[[ item.technicalName ]]">
              <li class="start" title="Start the instance."><button type='button' class="btn btn-raised btn-sm btn-success button" disabled>Start</button></li>
              <li class="stop" title="Stop the instance."><button type='button' class="btn btn-raised btn-sm btn-danger button" v-on:click="stopInstance">Stop</button></li>
              <li class="delete" title="Delete the instance."><button type='button' class="btn btn-raised btn-sm btn-warning button" v-on:click="deleteInstance">Delete</button></li>
              <li class="updateConfig" title="Update the instance configuration."><button type='button' id='displayConfig' class="btn btn-raised btn-sm btn-info button" v-on:click="displayConfig">Config </button></li>
              <li class="updateData" title="Upload data for the instance."><button type='button' id='btn_data' class="btn btn-raised btn-sm btn-info button" v-on:click="displayFormUpload">Data</button></li>
              <li class="openPublicLink" title="Open the instance."><a class="btn btn-raised btn-sm btn-link button" target="[[ item.target ]]" class="publicLink" href='[[ item.publicURL ]]'>Access</a></li>
              <li v-if="[[ publicDomain ]] != ''" class="openPublicLink" title="Open the instance."><a class="btn btn-raised btn-sm btn-link button"  target="[[ item.target ]].[[ publicDomain ]]" class="publicLink" href='http://[[ item.target ]].[[ publicDomain ]]'>Public Access </a></li>
            </ul>
          </td>
        </tr>

        <tr v-else class="danger" id="[[ item.containerId ]]">
          <td>[[ item.longName ]]</td>
          <td>[[ item.technicalName ]]</td>
          <td>[[ item.creationDate ]]</td>
          <td>[[ item.app ]]</td>
          <td><span v-else>Stopped</span></td>
          <td class="actions">
            <ul class="bread" id="[[ item.technicalName ]]">
              <li class="start" title="Start the instance"><button type='button' class="btn btn-raised btn-sm btn-success button" v-on:click="startInstance">Start</button></li>
              <li class="stop" title="Stop the instance"><button type='button' class="btn btn-raised btn-sm btn-danger button" disabled>Stop</button></li>
              <li class="delete" title="Delete the instance"><button type='button' class="btn btn-raised btn-sm btn-warning button" v-on:click="deleteInstance">Delete</button></li>
              <li class="updateConfig" title="Updating configuration of the instance"><button type='button' id='displayConfig' class="btn btn-raised btn-sm btn-info button" v-on:click="displayConfig">Config</button></li>
              <li class="updateData" title="Upload data for the instance."><button type='button' id='btn_data' class="btn btn-raised btn-sm btn-info button" v-on:click="displayFormUpload">Data</button></li>
              <li class="openPublicLink" title="Open the instance"><button type="button" class="btn btn-raised btn-sm btn-link button" disabled>Access</button></li>
              <li v-if="[[ publicDomain ]] != ''" class="openPublicLink" title="Open the instance"><button type="button" class="btn btn-raised btn-sm btn-link button" disabled>Public Access</button></li>
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
              <span class="deleteConfirmationMessage">You will delete the <span class="text-warning">[[ technicalNameToDelete ]]</span> instance.</span><br /><br />
              <span class="deleteSizeFolder">It represents <span class="text-warning">[[ sizeToDelete ]]</span> of data.</span>
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
            <a id='buttonUpdate' class="btn btn-info button-right" v-on:click="updateConfig">Update</a>
            <a id='buttonUpdateDisable' class="btn btn-info button-update" disabled>Update</a>
          </div>
        </div>
      </div>
    </div>
  </div>


  <!-- Modal Show Upload Data Files -->
  <div class="modal" id="modal-upload-data">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="panel panel-info">
          <div class="panel-heading">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelUpload">×</button>
            <h3 class="panel-title">Data Upload - Instance [[ instanceName ]]</h3>
          </div>
          <div class="panel-body">

            <!-- The form calls directly a route to perform the upload. -->
            <form method="POST" action="/-/v1/instances/[[ instanceId ]]/data/" enctype="multipart/form-data" class="form-inline">

              <fieldset>

                <label class="btn btn-success btn-file" style="float:left;margin-right:20px;">
                    Add File <input type="file" name="btnFile" id="btnFile" style="display: none; float: right;" required multiple @change="onChangeInputFile">
                </label>

                <!--<input type="file" name="btnFile" id="btnFile" required multiple class="input-large btn btn-file">-->

                <div class="list-infos-file">
                  <div><span id="spanFileName"></span></div>
                  <div><span id="spanFileSize"></span></div>
                  <div><span id="spanFileType"></span></div>
                </div>

                <div>
                  <input type="submit" id="submitUpload" value="Upload" class="btn btn-info" v-on:click="uploadData">
                </div>

              </fieldset>

            </form>

            <br />

            <div class="nb-files">
              <h4>[[ nbDataFiles ]] Data File(s)</h4>
            </div>

            <div class="button-refresh">
              <input type="button" value="Refresh List" class="btn btn-info" v-on:click="refreshDataFilesList">
            </div>

            <div id="filesList">
              <table id="data-files-table" class="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="file in files">
                      <tr id="[[ file.name ]]">
                        <td class="files-list-name-column">[[ file.name ]]</td>
                        <td>[[ file.size ]]</td>
                        <td>[[ file.mimeType ]]</td>
                        <td>
                          <input type="button" value="Delete" class="btn btn-danger" v-on:click="deleteUploadedFile">
                        </td>
                      </tr>
                    </template>
                  </tbody>
              </table>
            </div>

          </div>

          <div class="panel-footer">

            <a class="btn btn-danger" id="cancelUpload" v-on:click='cancelUpload' data-dismiss="modal">Exit</a>

          </div>

        </div>
      </div>
    </div>
  </div>

</template>



<script>

  /* global Vue, global document, global JSONEditor, global io*/
  // Socket connection.

  var socket = io();
  var optsEditor = {};
  var editor = new JSONEditor();
  var filesize = require('filesize');

  export default {

    ready () {

      let self = this;
      // Call the route /-/v1/instances with a get wich get the instances list.
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
      });
    },

    methods: {

      startInstance : function (event) {

        // event.path[4].id go up 4 times in the HTML tree to get the id of the reached element.
        // Here, the instance id.
        // button start > li > ul > td > tr > id="[[ item.description.Id ]]"
        this.$http.put('/-/v1/instances/start/'+event.path[4].id).then(function (result) {
        }, console.error);

      },

      stopInstance : function (event) {

        this.$http.put('/-/v1/instances/stop/'+event.path[4].id).then(function (result) {
        }, console.error);

      },

      deleteInstance : function (event) {

        // Update the data variable instanceId which will automatically update the HTML with this new value.
        this.instanceId = event.path[4].id;

        this.$http.get('/-/v1/instances/'+this.instanceId).then(function (result) {

          this.technicalNameToDelete = result.data.technicalName;
          this.sizeToDelete = result.data.size;

          document.getElementById('modal-delete-instance').style.display = 'block';

        }, console.error);

      },

      cancelDeleteInstance : function (event) {
        document.getElementById('modal-delete-instance').style.display = 'none';
      },

      confirmDeleteInstance : function (event) {
        this.$http.delete('/-/v1/instances/'+this.instanceId).then(function (result) {
          document.getElementById('modal-delete-instance').style.display = 'none';
        }, console.error);
      },

      displayConfig : function (event) {

        document.getElementById('jsoneditor').innerHTML = '';

        // Update the data variable instanceId which will automatically update the HTML with this new value.
        this.instanceId = event.path[4].id;

        this.$http.get('/-/v1/instances/'+this.instanceId).then(function (result) {

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
          editor.set(result.data.config);

        });
      },

      cancelConfig : function (event) {
        document.getElementById('modal-update-config').style.display = 'none';
      },

      updateConfig : function (event) {
        var newConfig = editor.get();
        var data = {
          newConfig : newConfig,
          newTitle : newConfig.title
        };
        this.$http.put('/-/v1/instances/config/'+this.instanceId, data).then(function (result) {
          document.getElementById('modal-update-config').style.display = 'none';
        });
      },

      displayFormUpload : function (event) {

        // Shows the modal upload and reset the inputs.
        document.getElementById('modal-upload-data').style.display = 'block';
        document.getElementById('submitUpload').style.display = 'none';
        document.getElementById('spanFileName').innerHTML = "";
        document.getElementById('spanFileSize').innerHTML = "";
        document.getElementById('spanFileType').innerHTML = "";


        // event.path[4].id go up 4 times in the HTML tree to get the id of the reached element.
        // Update the data variable instanceId which will automatically update the HTML with this new value.
        this.instanceId = event.path[4].id;
        // Update the data variable instanceName which will automatically update the HTML with this new value.
        this.instanceName = event.path[2].id;

        // Get information on formerly uploaded files for the concerned instance.
        this.$http.get('/-/v1/instances/'+this.instanceId+'/data').then(function (result) {

          // Update the data variable files which will automatically update the data files list on the modal.
          this.files = result.data;

          // Update the data variable nbDataFiles which will automatically update the HTML with this new value.
          this.nbDataFiles = Object.keys(this.files).length;

          // If there are no files already uploaded we don't show the files list.
          if(this.nbDataFiles > 0)
            document.getElementById('filesList').style.display = 'block';
          else
            document.getElementById('filesList').style.display = 'none';

        }, console.error);

      },

      cancelUpload : function (event) {

        document.getElementById('modal-upload-data').style.display = 'none';
        document.getElementById('btnFile').value = "";

      },

      onChangeInputFile : function (event) {

        // When the user choose a file.

        // Get information on total size allowed and free disk space.
        // Warn the user if a problem appears.
        this.$http.get('/-/v1').then(function (result) {

          document.getElementById('submitUpload').style.display = 'block';

          var btn = document.getElementById('btnFile').value;

          // We calculate the total size of selected files.

          var files = document.getElementById('btnFile').files;
          var nbFiles = 0

          this.filesSize = 0;

          for(var i = 0 ; i < files.length ; i++) {
            nbFiles += 1;
            this.filesSize += files[i].size;
          }

          // Get the first file to check if it exists.
          var file = document.getElementById('btnFile').files[0];

          // If the file exists.
          if (file) {

            var fileSize = 0;
            if (this.filesSize > 1024 * 1024 * 1024)
              fileSize = (Math.round(this.filesSize * 100 / (1024 * 1024 * 1024)) / 100).toString() + 'GB';
            else if (this.filesSize > 1024 * 1024)
              fileSize = (Math.round(this.filesSize * 100 / (1024 * 1024)) / 100).toString() + 'MB';
            else
              fileSize = (Math.round(this.filesSize * 100 / 1024) / 100).toString() + 'KB';

            // Display information on the selected file.
            document.getElementById('spanFileName').style.color = "black";
            if(nbFiles == 1) {
              document.getElementById('spanFileName').innerHTML = 'Name : ' + file.name;
              document.getElementById('spanFileType').innerHTML = 'Type : ' + file.type;
            }
            else {
              document.getElementById('spanFileName').innerHTML = 'Name : Multi Files';
              document.getElementById('spanFileType').innerHTML = 'Type : Multi Types';
            }
            document.getElementById('spanFileSize').innerHTML = 'Size : ' + fileSize;

          }

          // Checking if total file size is (or not) above free disk space.
          if (this.filesSize >= result.data.freeDiskSpace) {

            document.getElementById('spanFileName').innerHTML = 'ERROR';
            document.getElementById('spanFileSize').innerHTML = 'Total size upload : '+filesize(this.filesSize);
            document.getElementById('spanFileType').innerHTML = 'Free space : '+filesize(result.data.freeDiskSpace);
            document.getElementById('spanFileName').style.color = "red";
            document.getElementById('submitUpload').style.display = 'none';

          }

          // Checking if total file size is (or not) above allowed total size.
          if (this.filesSize > result.data.sizeAllowed) {

            document.getElementById('spanFileName').innerHTML = 'ERROR';
            document.getElementById('spanFileSize').innerHTML = 'Total size upload : '+filesize(this.filesSize);
            document.getElementById('spanFileType').innerHTML = 'Total size allowed : '+filesize(result.data.sizeAllowed);
            document.getElementById('spanFileName').style.color = "red";
            document.getElementById('submitUpload').style.display = 'none';

          }

        });

      },

      uploadData : function (event) {

        // When the user click on the upload button.

        var btn = document.getElementById('btnFile').value;
        //var file = btn.split('\\')[2];

        // Check if a file has been selected or not and give a feedback to the user.
        if(btn != "") {

          document.getElementById('spanFileName').innerHTML = "Uploaded";
          document.getElementById('spanFileName').style.color = "green";

        }
        else {

          document.getElementById('spanFileName').innerHTML = "No file selected.";
          document.getElementById('spanFileName').style.color = "red";

        }

      },

      deleteUploadedFile : function () {

        // event.path[2].id go up 2 times in the HTML tree to get the id of the reached element.
        // Here the file name.
        var fileName = event.path[2].id;

        // Delete the file.
        this.$http.delete('/-/v1/instances/'+this.instanceId+'/'+fileName).then(function (resultDelete) {

          // Get information on formerly uploaded files for the concerned instance.
          this.$http.get('/-/v1/instances/'+this.instanceId+'/data').then(function (resultGet) {

            // Update the data variable nbDataFiles which will automatically update the HTML with this new value.
            this.nbDataFiles = Object.keys(this.files).length;

            // Update the data variable files which will automatically update the data files list on the modal.
            this.files = resultGet.data;

            // Update the data variable nbDataFiles which will automatically update the HTML with this new value.
            this.nbDataFiles -= 1;

            // If there are no files already uploaded we don't show the files list.
            if(this.nbDataFiles > 0)
              document.getElementById('filesList').style.display = 'block';
            else
              document.getElementById('filesList').style.display = 'none';

            document.getElementById(fileName).style.display = 'none';

          }, console.error);

        });

      },

      refreshDataFilesList : function (event) {

        // Get information on formerly uploaded files for the concerned instance.
        this.$http.get('/-/v1/instances/'+this.instanceId+'/data').then(function (result) {

          // Update the data variable files which will automatically update the data files list on the modal.
          this.files = result.data;

          // Update the data variable nbDataFiles which will automatically update the HTML with this new value.
          this.nbDataFiles = Object.keys(this.files).length;

          // If there are no files already uploaded we don't show the files list.
          if(this.nbDataFiles > 0)
            document.getElementById('filesList').style.display = 'block';
          else
            document.getElementById('filesList').style.display = 'none';

        }, console.error);

      },







    }, // End of Methods


    data () {
      return {
        sizeToDelete : '',
        technicalNameToDelete : '',
        containers : [],
        publicDomain : '',
        instanceId : '',
        files : {},
        nbDataFiles : 0,
        instanceName : "",
        filesSize : 0
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

  #progress p
  {
    display: block;
    width: 240px;
    padding: 2px 5px;
    margin: 2px 0;
    border: 1px inset #446;
    border-radius: 5px;
  }

  #progress p.success
  {
    background: #0c0 none 0 0 no-repeat;
  }

  #progress p.failed
  {
    background: #c00 none 0 0 no-repeat;
  }

  #modal-data-files{
    height:100%;
  }

  #data-files-table{
    table-layout: fixed;
    word-wrap: break-word;
  }

  .modal-dialog{
      overflow-y: initial !important
  }

  #filesList{
      width:100%;
      height: 250px;
      overflow-y: auto;
  }

  .button-right{
      float:right;
  }

  .button-update{
    float:right;
    display:none;
  }

  .list-infos-file{
    float:left;
    margin-right:20px;
  }

  .nb-files{
    float:left;
  }

  .button-refresh{
    float:right;
  }

  .files-list-name-column{
    width:10%;
  }

</style>