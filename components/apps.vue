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
        <tr class="success" id="[[ item.imageName ]]">
          <td>[[ item.imageName ]]</td>
          <td>[[ item.creationDate ]]</td>
          <td class="actions">
            <ul class="bread">
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
                      <div id='errorLoaderImage' class="error-loader">
                    <span class="text-danger" id="errorLoaderAddInstance">An error was received : [[ messageErrorPull ]].</span><br />
                  </div>
                    </div>
                    <div class="panel-footer">
                      <a class="btn btn-default" v-on:click='cancelDeleteapplication' data-dismiss="modal">Cancel</a>
                      <a class="btn btn-warning button-delete" v-on:click="confirmDeleteapplication">Delete</a>
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
    ,nameTodelete
    ;


  export default {

    ready () {

      let self = this;

      // ... call the route /-/v1/instances with a get wich get the instances list.
      // Store the instances list into the variable containers used into the HTML with v-for.
      self.$http.get('/-/v1/app').then(function (result) {
        self.$set('containers', result.data);
      }, console.error);

    },
    methods: {

      refresh : function () {
        this.$http.get('/-/v1/app').then(function (result) {
          this.$set('containers', result.data);
        }, console.error);
        this.$set('messageErrorPull', '');
      },


      deleteapplication : function (event) {

        this.$set('imageNameToDelete', event.path[4].id);
        nameTodelete = event.path[4].id;
        document.getElementById('modal-delete-image').style.display = 'block';

      },

      cancelDeleteapplication : function (event) {
        document.getElementById('modal-delete-image').style.display = 'none';
        this.$set('messageErrorPull', '');
        document.getElementById('errorLoaderImage').style.display = 'none';
      },

      confirmDeleteapplication : function (event) {

        var name = new Buffer(nameTodelete).toString('base64');
        this.$http.delete('/-/v1/app/'+name).then(function (result) {
          document.getElementById('modal-delete-image').style.display = 'none';
          this.refresh();
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

  .error-loader{
    display: none;
    text-align: center;
  }

  .button-delete{
    float:right;
  }

</style>