<template>
  <table id="applications-table" class="table table-striped">
    <thead>
      <tr>
        <th>Image</th>
        <th>Creation Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in containers">
        <tr class="success" id="[[ item.imageId ]]">
          <td>[[ item.imageName ]]</td>
          <td>[[ item.creationDate ]]</td>
          <td class="actions">
            <ul class="bread" style="margin-bottom:0px">
              <li class="delete" title="Delete the application"><button type='button' class="btn btn-raised btn-sm btn-warning button" v-on:click="deleteapplication">Delete</button></li>
            </ul>

            <div class="modal" id="modal-delete-image">
              <div class="modal-dialog">
                <div class="modal-content">
                   <div class="panel panel-warning">
                    <div class="panel-heading">
                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelDeleteapplication">×</button>
                      <h3 class="panel-title">Delete application</h3>
                    </div>
                    <div class="panel-body">
                      <p>
                        <span class="deleteConfirmationMessage">You will delete the <span class="text-warning">[[ imageNameToDelete ]]</span> application.</span><br /><br />
                      </p><br />
                      <div id='errorLoaderImage' style='display:none; text-align: center;'>
                    <span class="text-danger" id="errorLoaderAddInstance">An error was received : [[ messageErrorPull ]].</span><br />
                  </div>
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
    , idToDelete = null
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


      deleteapplication : function (event) {
        idToDelete = event.path[4].id;
        this.$http.get('/-/v1/app/'+idToDelete+'/delete').then(function (result) {
          this.$set('imageNameToDelete', result.data.imageName);
          document.getElementById('modal-delete-image').style.display = 'block';

        }, console.error);
      },

      cancelDeleteapplication : function (event) {
        document.getElementById('modal-delete-image').style.display = 'none';
      },

      confirmDeleteapplication : function (event) {
        this.$http.delete('/-/v1/app/'+idToDelete).then(function (result) {
          document.getElementById('modal-delete-image').style.display = 'none';
          this.refresh();
          console.log(result);
        }, function (error) {
            console.log(error);
            this.$set('messageErrorPull', 'This image is being used by one or many instance(s), please delete them first');
            console.log(error.data);
            document.getElementById('errorLoaderImage').style.display = 'block';
        });

      },


    data () {
      return {
        sizeToDelete : '',
        imageNameToDelete : '',
        containers : [],
        messageErrorPull : '',
        publicDomain : ''
      }
    }

  }
}


</script>

<style>
#applications-table {
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

</style>