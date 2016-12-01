<template>
  <table id="applications-table" class="table table-striped table-hover">
    <thead>
      <tr>
        <th>Image</th>
        <th>Creation Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in Store.applications">
        <tr :id="item.imageName" scope="row">
          <td>{{ item.imageName }}</td>
          <td>{{ item.creationDate }}</td>
          <td class="actions">
            <ul class="bread">
              <li class="delete" title="Delete the application">
                <button type='button' data-toggle="modal" data-target="#modal-delete-image" class="btn btn-raised btn-sm btn-warning button" :id="item.imageName" v-on:click="deleteapplication">Delete</button>
              </li>
            </ul>
            <div class="modal fade" tabindex="-1" role="dialog" id="modal-delete-image">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="panel panel-warning">
                    <div class="panel-heading">
                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelDeleteapplication">×</button>
                      <h3 class="panel-title">Delete application</h3>
                    </div>
                    <div class="panel-body">
                      <p>
                      <span class="deleteConfirmationMessage">You will delete the <span class="text-warning">{{ imageNameToDelete }}</span> application.</span><br /><br />
                      </p><br />
                      <div id="errorLoaderImage" class="error-loader">
                        <span class="text-danger" id="errorLoaderAddInstance">An error was received : {{ messageErrorPull }}.</span><br />
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
var nameTodelete;

import Store from './store.js'


export default {
  methods: {

    deleteapplication: function (event) {
      this.imageNameToDelete = event.target.id;
      nameTodelete = event.target.id;
    },

    cancelDeleteapplication: function (event) {
      this.messageErrorPull = '';
      document.getElementById('errorLoaderImage').style.display = 'none';
    },

    confirmDeleteapplication: function (event) {
      const self = this;
      // skip if button already disabled
      if ($('a.button-delete').attr('disabled')) {
        return;
      }
      $('a.button-delete').attr('disabled', 'disabled');

      var name = new Buffer(nameTodelete).toString('base64');
      this.$http.delete('/-/v1/app/' + name).then(function (result) {
        $('a.button-delete').removeAttr('disabled');
        self.$emit('refreshApplicationsList');
      }, function (err) {
        $('a.button-delete').removeAttr('disabled');
        var msgDetails = (err && err.data && err.data.json) ? ('\n' + err.data.json.message) : '';
        this.messageErrorPull =
          'This image is being used by one or many instance(s), please delete them first.' +
          msgDetails;
        document.getElementById('errorLoaderImage').style.display = 'block';
      });
    }

  },

  data () {
    return {
      Store,
      sizeToDelete: '',
      imageNameToDelete: '',
      applications: [],
      messageErrorPull: '',
      publicDomain: ''
    };
  }
};

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
