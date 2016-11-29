<template>
  <div id="addImage">
    <button class="btn btn-raised btn-primary" data-toggle="modal" data-target="#modal-add-image">Add Application</button>

    <div class="modal fade" id="modal-add-image"  tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <form novalidate id="add-image-form" name="Form" class="form-horizontal">
            <fieldset>
              <div class="modal-header modal-addapp">
                <legend>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">×</button>
                  <span class="titleFormAddInstance">Add Application</span>
                </legend>
              </div>
              <br />
              <div class="modal-body">

                <div class="form-group">
                  <label for="inputImageName" class="col-md-3 control-label">Application Name</label>
                  <div class="col-md-9">
                    <input class="form-control sizeInput"
                           id="inputImageName"
                           name="inputImageName"
                           placeholder="inistcnrs/ezvis"
                           type="text"
                           v-model="imageName"
                           v-on:blur.stop="searchTags"
                           >
                           <select class="form-control sizeInput" v-bind:disabled="isSearchingTags" id="inputVersionImage" v-model="versionImage">
                             <option v-for="(version, index) in applicationVersions">
                             {{ version.name }}
                             </option>
                           </select>
                  </div>

                  <button type="button" class="btn btn-default btn-md" v-on:click='toggleSettings'>
                    <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Settings
                  </button>


                  <div class="form-group" id='settings' v-show="show">
                    <label for="inputImageHub" class="col-md-3 control-label">Docker registry</label>
                    <div class="col-md-9">
                      <input class="form-control" id="inputImageHub" name="inputImageHub" placeholder="vsregistry.intra.inist.fr:5000" type="text" v-model="imageHub">
                    </div>

                    <label for="inputUserName" class="col-md-3 control-label">UserName</label>
                    <div class="col-md-9">
                      <input class="form-control sizeInput" id="inputUserName" name="inputUserName" placeholder="username" type="text" v-model="username">
                    </div>

                    <label for="inputImageHub" class="col-md-3 control-label">Password</label>
                    <div class="col-md-9">
                      <input class="form-control sizeInput" id="inputPassword" name="inputPassword" placeholder="password" type="password" v-model="password">
                    </div>

                    <label for="inputEmail" class="col-md-3 control-label">Email</label>
                    <div class="col-md-9">
                      <input class="form-control sizeInput" id="inputEmail" name="inputEmail" placeholder="test@email.com" type="text" v-model="email">

                    </div>

                  </div>
                </div>




                <div class="panel-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary button-add" v-on:click="addImage" v-bind:disabled="disableAddButton">Add</button>
                  <div id='loaderImage' class="loader">
                    <img id="loaderAddInstance" src="/img/ajax-loader.gif" alt="Loading"/><br />
                    <span class="text-primary" id="messageLoaderAddInstance">{{ statusPull }}</span>
                  </div>
                  <div id='errorLoaderImages' class="loader">
                    <span class="text-danger" id="errorLoaderAddImage">An error {{ codeErrorPull }} was received : {{ messageErrorPull }}.</span><br />
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  </div>

                </div>
            </fieldset>
          </form>
              </div>
        </div>
      </div>
    </div>

</template>


<script>
/* global io */
var socket = io();

export default {

  mounted () {
    var self = this;
    var fullFsPercent;

    socket.on('statusPull', function (infoPull) {
      self.statusPull = infoPull;
    })

    self.$http.get('/-/v1/config').then(function (result) {
      var config = result.data;
      self.fullFsPercent = config.fullFsPercent;
      fullFsPercent = config.fullFsPercent;
    }, console.error)

    socket.on('refreshInfosMachine', function (infosMachineSocket) {
      // Update variable 'infosMachine'.
      // This will automatically refresh the infosMachineTable component.
      self.infosMachine = infosMachineSocket;
      // Put this bool to true in order to avoid console error on infosMachine component launch.
      // This bool is used on the HTML code just above.
      self.boolInfosFeed = true;
      self.disableAddButton = fullFsPercent < infosMachineSocket.useDiskPercentage;
    })
  },

  methods: {

    searchTags: function () {
      const self = this;
      if (self.isSearchingTags === true) {
        return
      }
      self.isSearchingTags = true;
      self.applicationVersions = [];
      if (self.imageName.search(/\w\/\w/) >= 0) {
        const url = '/-/v1/hub/repositories/' + self.imageName.trim() + '/tags/?page=1&page_size=5';
        self.applicationVersions = [];
        self.$http.get(url).then((response) => {
          self.cacheImageVersions[self.imageName] = true;
          if (response.body && response.body.results && Array.isArray(response.body.results)) {
            response.body.results.forEach(function (item) {
              self.$set(self.applicationVersions, self.applicationVersions.length, item)
            })
          }
          self.isSearchingTags = false;
        }, (response) => {
          self.isSearchingTags = false;
        })
      }
      else {
        self.isSearchingTags = false;
      }
    },
    addImage: function (event) {
      var self = this;

      document.getElementById('loaderImage').style.display = 'block';

      var formdata = {
        imageName: this.imageName,
        versionImage: this.versionImage,
        imageHub: this.imageHub,
        username: this.username,
        password: this.password,
        email: this.email
      }

      this.$http.post('/-/v1/app', formdata).then(function (result) {
        if (result.status === 200) {
          $('#modal-add-image').modal('hide');
          self.$emit('refreshApplicationsList');
        }
      }, function (error) {
        if (error) {
          this.codeErrorPull = error.status;
          this.messageErrorPull = error.data;
          document.getElementById('loaderImage').style.display = 'none';
          document.getElementById('errorLoaderImages').style.display = 'block';
        }
      })
    },

    toggleSettings: function (event) {
      this.show = !this.show;
    }

  },

  data () {
    return {
      imageName: '',
      versionImage: '',
      cacheImageVersions: {},
      messageErrorPull: '',
      imageHub: '',
      email: '',
      password: '',
      username: '',
      show: false,
      statusPull: '',
      codeErrorPull: '',
      infosMachine: {},
      fullFsPercent: '',
      disableAddButton: false,
      boolInfosFeed: false,
      applicationVersions: [],
      isSearchingTags: false
    }
  }

}

</script>



<style scoped>

#add_image {
  margin-left: 2.5%;
  background-color:#0277BD;
}

  .sizeInput {
    width : 32%;
  display: inline-block;
  }

  .block-input {
    display: block;
  }

  #urlPreview{
    background-color:       #CFD8DC;
  }

  .titleFormAddInstance {
    color:white;
  }

  .modal-addapp{
    background-color: #0277BD;
    border:solid white 5px;
  }

  .button-add{
    float:right;
  }

  .button-add-disabled{
    float:right;
  }

  .button-add-disabled-none{
    float:right;
    display: none;
  }

  .loader{
    display:none;
    text-align: center;
  }
  #addImage {
    margin-left: 2.5%;
  }
</style>
