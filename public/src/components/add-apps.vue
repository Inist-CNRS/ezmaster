
<!--
  This is a .vue component divided into 3 parts :
  - <template> containing the HTML code of this component.
  - <script> containing the javascript code of this component.
  - <style> containing the CSS code of this component.
 -->

<template>

  <div id="addImage" v-on:keyup.esc="cancelAddApp">
    <button class="btn btn-raised btn-primary" data-toggle="modal" data-target="#modal-add-image">Add Application</button>

    <div class="modal" id="modal-add-image">
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
                      <input class="form-control sizeInput" id="inputImageName" name="inputImageName" placeholder="inistcnrs/ezvis" type="text" v-model="imageName">
                      <input class="form-control sizeInput" id="inputVersionImage" placeholder="6.8.11" type="text" min='0' v-model="versionImage">
                    </div>

                    <button type="button" class="btn btn-default btn-md" v-on:click='showSettings'>
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
                    <button type="button" id='tryAgain' v-on:click='tryAgain' class="btn btn-danger">Cancel</button>
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
  var socket = io()

  export default {

    mounted () {
      var self = this
      var fullFsPercent

      socket.on('statusPull', function (infoPull) {
        self.statusPull = infoPull
      })

      self.$http.get('/-/v1/config').then(function (result) {
        var config = result.data
        self.fullFsPercent = config.fullFsPercent
        fullFsPercent = config.fullFsPercent
      }, console.error)

      socket.on('refreshInfosMachine', function (infosMachineSocket) {
        // Update variable 'infosMachine'.
        // This will automatically refresh the infosMachineTable component.
        self.infosMachine = infosMachineSocket
        // Put this bool to true in order to avoid console error on infosMachine component launch.
        // This bool is used on the HTML code just above.
        self.boolInfosFeed = true
        self.disableAddButton = fullFsPercent < infosMachineSocket.useDiskPercentage
      })
    },

    methods: {

      addImage: function (event) {
        var self = this

        document.getElementById('loaderImage').style.display = 'block'

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
            $('#modal-add-image').modal('hide')
            self.$emit('refreshApplications')
          }
        }, function (error) {
          if (error) {
            this.codeErrorPull = error.status
            this.messageErrorPull = error.data
            document.getElementById('loaderImage').style.display = 'none'
            document.getElementById('errorLoaderImages').style.display = 'block'
          }
        })
      },

      tryAgain: function (event) {
        location.reload()
      },

      cancelAddApp: function (event) {
        $('#modal-add-image').modal('hide')
      },

      showSettings: function (event) {
        if (this.show === false) {
          this.show = true
        }
        else {
          this.show = false
        }
      }

    },

    data () {
      return {
        imageName: '',
        versionImage: '',
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
        boolInfosFeed: false
      }
    }

  }

</script>



<style>

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

  #inputLongName, #inputProject, #inputStudy {
     background-color:        #FFCDD2;
  }

  #urlPreview{
      background-color:       #CFD8DC;
  }

  #save, #saveTechnicalExists {
      background-color:#0277BD;
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

</style>
