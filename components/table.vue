
<template>

    <table id="instances-table" class="table table-striped">
      <thead>
        <tr>
          <th>Long Name</th>
          <th>Technical name</th>
          <th>Creation date</th>
          <th>App</th>
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
                <li class="delete" title="Delete the instance"><button type='button' class="btn btn-raised btn-sm btn-warning button" v-on:click="confirmationDelete">Delete</button></li>
                <li class="updateConfig" title="Updating configuration of the instance"><button type='button' id='displayConfig' class="btn btn-raised btn-sm btn-info button" v-on:click="displayConfig">Config </button></li>
                <li class="openPublicLink" title="Open the instance"><a class="btn btn-raised btn-sm btn-link button" target="[[ item.target ]]" class="publicLink" href='[[ item.publicURL ]]'>Access</a></li>
                <li v-if="[[ publicDomain ]] != ''" class="openPublicLink" title="Open the instance"><a class="btn btn-raised btn-sm btn-link button"  target="[[ item.target ]].[[ publicDomain ]]" class="publicLink" href='http://[[ item.target ]].[[ publicDomain ]]'>Public Access </a></li>

              </ul>

              <div class="modal" id="modal-delete-instance">
                <div class="modal-dialog">
                  <div class="modal-content">
                     <div class="panel panel-warning">
                      <div class="panel-heading">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelDelete">×</button>
                        <h3 class="panel-title">Delete an instance</h3>
                      </div>
                      <div class="panel-body">
                        <p>
                          <span class="deleteConfirmationMessage">Are you sure to delete the instance called <span class="text-warning">[[ technicalNameToDelete ]]</span> ?</span><br /><br />
                          <span class="deleteSizeFolder">You will remove <span class="text-warning">[[ sizeToDelete ]]</span> of datas.</span>
                        </p><br />
                      </div>
                      <div class="panel-footer">
                        <a class="btn btn-default" v-on:click='cancelDelete' data-dismiss="modal">Cancel</a>
                        <a style='float:right' class="btn btn-warning" v-on:click="deleteInstance">Delete</a>
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
                        <h3 class="panel-title">Update instance configuration</h3>
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
                <li class="delete" title="Delete the instance"><button type='button' class="btn btn-raised btn-sm btn-warning button" v-on:click="confirmationDelete">Delete</button></li>
                <li class="updateConfig" title="Updating configuration of the instance"><button type='button' id='displayConfig' class="btn btn-raised btn-sm btn-info button" v-on:click="displayConfig">Config</button></li>
                <li class="openPublicLink" title="Open the instance"><button type="button" class="btn btn-raised btn-sm btn-link button" disabled>Access</button></li>
                <li v-if="[[ publicDomain ]] != ''" class="openPublicLink" title="Open the instance"><button type="button" class="btn btn-raised btn-sm btn-link button" disabled>Public Access</button></li>
              </ul>

              <div class="modal" id="modal-delete-instance">
                <div class="modal-dialog">
                  <div class="modal-content">
                     <div class="panel panel-warning">
                      <div class="panel-heading">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelDelete">×</button>
                        <h3 class="panel-title">Delete an instance</h3>
                      </div>
                      <div class="panel-body">
                        <p>
                          <span class="deleteConfirmationMessage">Are you sure to delete the instance called <span class="text-warning">[[ technicalNameToDelete ]]</span> ?</span><br /><br />
                          <span class="deleteSizeFolder">You will remove <span class="text-warning">[[ sizeToDelete ]]</span> of datas.</span>
                        </p><br />
                      </div>
                      <div class="panel-footer">
                        <a class="btn btn-default" v-on:click='cancelDelete' data-dismiss="modal">Cancel</a>
                        <a style='float:right' class="btn btn-warning" v-on:click="deleteInstance">Delete</a>
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
                        <h3 class="panel-title">Update instance configuration</h3>
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

        /*global Vue, global io*/

        // Socket connection.
        var socket = io();



        export default {

              ready () {   // When the table is ready...

                let self = this;

                // Listen incoming messages typed as 'refreshInfosMachine' from the server.
                // Here the message comes from eventRefreshInfosMachine.js.
                socket.on('refreshInfosMachine', function(infosMachine) {
                  // Update variable 'infosMachine'.
                  // This will automatically refresh the infosMachineTable component.
                  self.$set('infosMachine', infosMachine);
                });

              }
        }

</script>



<style>



</style>