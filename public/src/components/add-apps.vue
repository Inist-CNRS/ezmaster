<template>
  <div id="addImage">
    <button class="btn btn-raised btn-primary" data-toggle="modal" data-target="#modal-add-image" v-bind:disabled="fsIsAlmostFilled"><span data-toggle="tooltip" data-placement="right" :data-original-title="fsIsAlmostFilled ? 'File system almost full, please free disk space to be able to add an application.' : ''">Add Application</span></button>

    <div class="modal fade" id="modal-add-image"  tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">×</button>
            <h4 class="modal-title">Add Application</h4>
          </div>

          <div class="modal-body">
            <form novalidate id="add-image-form" name="Form" class="form-horizontal">
              <div class="form-group">
                <label for="inputImageName" class="col-md-3 control-label">Application Name</label>
                <div class="col-md-9">
                  <input class="form-control sizeInput"
                          list="applicationImages"
                          id="inputImageName"
                          placeholder="inistcnrs/ezvis"
                          type="text"
                          v-model="imageName"
                          v-on:keydown.stop="searchImages"
                          v-on:blur.stop="searchTags">

                  <datalist id="applicationImages">
                    <option v-for="(image, index) in applicationImages">
                    {{ image.repo_name }}
                    </option>
                  </datalist>

                  <input class="form-control sizeInput"
                          list="applicationTags"
                          placeholder="1.0.0"
                          type="text"
                          v-model="imageTag"
                          v-on:keydown.stop="searchTags">

                  <datalist id="applicationTags">
                    <option v-for="(tag, index) in applicationTags">
                    {{ tag.name }}
                    </option>
                  </datalist>
                </div>
              </div>

              <button type="button" class="btn btn-default btn-md" v-on:click='toggleSettings'>
                <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Settings
              </button>

              <div class="form-group" id="settings" v-show="show">
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

            </form>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary button-add" v-on:click="addImage" v-bind:disabled="isAdding">Add</button>
            <div id="loaderImage" class="loader">
              <img id="loaderAddInstance" src="/img/ajax-loader.gif" alt="Loading"/><br />
              <span class="text-primary" id="messageLoaderAddInstance">{{ statusPull }}</span>
            </div>
            <div id="errorLoaderImages" class="loader">
              <span class="text-danger" id="errorLoaderAddImage">An error {{ codeErrorPull }} was received : {{ messageErrorPull }}.</span><br />
              <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Store from './store.js';
export default {

  mounted () {
    var self = this;

    // enables the bootstrap component for tooltips
    $('#addImage [data-toggle="tooltip"]').tooltip();

    self.Store.socket.on('statusPull', function (infoPull) {
      self.statusPull = infoPull;
    });

    self.$http.get('/-/v1/config').then(function (result) {
      var config = result.data;
      self.fullFsPercent = config.fullFsPercent;
    }, console.error);

    self.Store.socket.on('refreshInfosMachine', function (infosMachineSocket) {
      // Update variable 'infosMachine'.
      // This will automatically refresh the infosMachineTable component.
      self.infosMachine = infosMachineSocket;
      // Put this bool to true in order to avoid console error on infosMachine component launch.
      // This bool is used on the HTML code just above.
      self.boolInfosFeed = true;
      self.fsIsAlmostFilled = infosMachineSocket.fsIsAlmostFilled;
    });
  },

  methods: {

    searchImages () {
      const self = this;
      if (self.isSearchingImages === true) {
        return;
      }
      self.isSearchingImages = true;
      self.applicationImages = [];
      const url = `/-/v1/hub/search/repositories/?query=${self.imageName}&page=1&page_size=5`;
      self.applicationImages = [];
      self.$http.get(url).then((response) => {
        if (response.body && response.body.results && Array.isArray(response.body.results)) {
          response.body.results.forEach(function (item) {
            self.$set(self.applicationImages, self.applicationImages.length, item);
          });
        }
        self.isSearchingImages = false;
      }, (response) => {
        self.isSearchingImages = false;
      });
    },
    searchTags () {
      const self = this;
      if (self.isSearchingTags === true) {
        return;
      }
      self.isSearchingTags = true;
      self.applicationTags = [];
      if (self.imageName.search(/\w\/\w/) >= 0) {
        const url = '/-/v1/hub/repositories/' + self.imageName.trim() + '/tags/?page=1&page_size=5';
        self.applicationTags = [];
        self.$http.get(url).then((response) => {
          self.cacheImageVersions[self.imageName] = true;
          if (response.body && response.body.results && Array.isArray(response.body.results)) {
            response.body.results.forEach(function (item, index) {
              self.$set(self.applicationTags, self.applicationTags.length, item);
            });
          }
          self.isSearchingTags = false;
        }, (response) => {
          self.isSearchingTags = false;
        });
      }
      else {
        self.isSearchingTags = false;
      }
    },
    addImage (event) {
      var self = this;

      self.isAdding = true;
      document.getElementById('loaderImage').style.display = 'block';

      var formdata = {
        imageName: this.imageName,
        versionImage: this.imageTag,
        imageHub: this.imageHub,
        username: this.username,
        password: this.password,
        email: this.email
      };

      this.$http.post('/-/v1/app', formdata).then(function (result) {
        if (result.status === 200) {
          $('#modal-add-image').modal('hide');
          self.$emit('refreshApplicationsList');
        }
      }, function (error) {
        self.isAdding = true;
        if (error) {
          this.codeErrorPull = error.status;
          this.messageErrorPull = error.data;
          document.getElementById('loaderImage').style.display = 'none';
          document.getElementById('errorLoaderImages').style.display = 'block';
        }
      });
    },

    toggleSettings: function (event) {
      this.show = !this.show;
    }

  },

  data () {
    return {
	  Store,
      imageName: '',
      imageTag: '',
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
      fsIsAlmostFilled: true,
      boolInfosFeed: false,
      applicationImages: [],
      isSearchingImages: false,
      applicationTags: [],
      isSearchingTags: false,
      isAdding: false
    };
  }

};

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
    background-color: #CFD8DC;
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
