
<!--
  This is a .vue component divided into 3 parts :
  - <template> containing the HTML code of this component.
  - <script> containing the javascript code of this component.
  - <style> containing the CSS code of this component.
 -->

<template>

  <div id='addImage' v-on:keyup.esc="cancelAddImage">
    <button id="add_image" class="btn btn-raised btn-primary" v-on:click="displayFormAddImage" >Add Application</button>

    <div class="modal" id="modal-add-image">
      <div class="modal-dialog">
        <div class="modal-content">
          <validator name="validation1">
            <form novalidate id="add-image-form" name="Form" class="form-horizontal">
              <fieldset>
                <div class="modal-header modal-addapp">
                  <legend>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelAddImage">×</button>
                    <span class="titleFormAddInstance">Add Application</span>
                  </legend>
                </div>
                <br />
                <div class="modal-body">

                  <div class="form-group">
                    <label for="inputImageName" class="col-md-3 control-label">Application Name</label>
                    <div class="col-md-9">
                      <input class="form-control sizeInput" id="inputImageName" name="inputImageName" placeholder=" Ex : inistcnrs/ezark" type="text" value='[[ imageName ]]' v-model="imageName" v-validate:imageName="{ required: true }">
                      <input class="form-control sizeInput" id="inputVersionImage" placeholder="Tag (ex: 2.1.0)" value="[[ versionImage ]]" type="text" min='0' v-model="version" v-validate:project="{ required: true}">
                    </div>

                    <button type="button" class="btn btn-default btn-md" v-on:click='showSettings'>
                      <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Settings
                    </button>


                    <div class="form-group" id='settings' v-show="show">
                      <label for="inputImageHub" class="col-md-3 control-label">Docker registry</label>
                      <div class="col-md-9">
                        <input class="form-control sizeInput" id="inputImageHub" name="inputImageHub" placeholder=" Ex : https://vsregistry:5000" type="text" value='[[ imageHub ]]' v-model="imageHub">
                      </div>

                      <label for="inputUserName" class="col-md-3 control-label">UserName</label>
                      <div class="col-md-9">
                        <input class="form-control sizeInput" id="inputUserName" name="inputUserName" placeholder=" Ex : username" type="text" value='[[ username ]]' v-model="username">
                      </div>

                      <label for="inputImageHub" class="col-md-3 control-label">Password</label>
                      <div class="col-md-9">
                        <input class="form-control sizeInput" id="inputPassword" name="inputPassword" placeholder=" Ex : password" type="password" value='[[ password ]]' v-model="password">
                      </div>

                      <label for="inputEmail" class="col-md-3 control-label">Email</label>
                      <div class="col-md-9">
                        <input class="form-control sizeInput" id="inputEmail" name="inputEmail" placeholder=" Ex : test@email.com" type="text" value='[[ email ]]' v-model="email">
                      </div>

                    </div>
                  </div>




                <div class="panel-footer">
                  <button type="button" id="close_modal_image" class="btn btn-default" v-on:click='cancelAddImage' data-dismiss="modal">Cancel</button>
                  <button v-if="$validation1.valid" type="button" id='save' class="btn btn-primary button-create" v-on:click='addImage'>Create</button>
                  <button v-else type="button" id='save' class="btn btn-primary button-create-disabled" disabled>Create</button>
                  <button type="button" id='saveTechnicalExists' class="btn btn-primary button-create-disabled-none" disabled>Create</button>
                  <div id='loaderImage' class="loader">
                    <img id="loaderAddInstance" src="../assets/img/ajax-loader.gif" alt="Loading"/><br />
                    <span class="text-primary" id="messageLoaderAddInstance">[[ progressPull ]]</span>
                  </div>
                   <div id='errorLoaderImages' class="loader">
                    <span class="text-danger" id="errorLoaderAddImage">An error [[ codeErrorPull ]] was received : [[ messageErrorPull ]].</span><br />
                    <button v-else type="button" id='tryAgain' v-on:click='tryAgain' class="btn btn-danger">Cancel</button>
                  </div>

                </div>
              </fieldset>
            </form>
          </validator>
        </div>
      </div>
    </div>
  </div>

</template>



<script>

  /* global Vue, global document, global location*/

  'use strict';


  export default {

    ready() {


          socket.on('progressBar', function(infoPull) {

            console.log("aaaa"+infoPull);

        // Update variable 'infosMachine'.
        // This will automatically refresh the infosMachineTable component.
        this.$set('progressPull', infoPull);

      });



    },

    methods : {


      displayFormAddImage : function (event) {
        document.getElementById('modal-add-image').style.display = 'block';
      },

      cancelAddImage : function (event) {
        document.getElementById('modal-add-image').style.display = 'none';
      },

      addImage : function (event) {
        this.imageName = document.getElementById('inputImageName').value;
        this.versionImage = document.getElementById('inputVersionImage').value;

        document.getElementById('close_modal_image').style.display = 'none';
        document.getElementById('loaderImage').style.display = 'block';

        var data = {
          'imageName' : this.imageName,
          'versionImage' : this.versionImage,
          'imageHub' : this.imageHub,
          'username' : this.username,
          'password' : this.password,
          'email' : this.email
        };

        this.$http.post('/-/v1/app', data).then(function (result) {

          if (result.status == 200) { location.reload(); }
        }, function (error) {

          if (error) {
            this.$set('codeErrorPull', error.status);
            this.$set('messageErrorPull', error.data);
            document.getElementById('loaderImage').style.display = 'none';
            document.getElementById('errorLoaderImages').style.display = 'block';
          }
        });
      },

      tryAgain : function (event) {
        location.reload();
      },

      showSettings : function (event) {

        if(this.show == false){
          this.$set('show', true);
        }else{
          this.$set('show', false);
        }

      }

    },


    data() {

      return {
        imageName : '',
        versionImage : '',
        messageErrorPull : '',
        imageHub : '',
        email: '',
        password: '',
        username: '',
        show : false,
        progressPull : '',
        codeErrorPull : ''
      }

    },

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

  .button-create{
    float:right;
  }

  .button-create-disabled{
    float:right;
  }

  .button-create-disabled-none{
    float:right;
    display: none;
  }

  .loader{
    display:none;
    text-align: center;
  }

</style>