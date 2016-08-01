
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
                <div class="modal-header" style="background-color: #0277BD; border:solid white 5px;">
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
                      <input class="form-control" id="inputImageName" name="inputImageName" placeholder=" Ex : Title - Comment - Note" type="text" value='[[ imageName ]]' v-model="imageName" v-validate:imageName="{ required: true }">
                    </div>
                  </div>

                <div class="panel-footer">
                  <button type="button" id="close_modal" class="btn btn-default" v-on:click='cancelAddImage' data-dismiss="modal">Cancel</button>
                  <button v-if="$validation1.valid" type="button" style='float:right' id='save' class="btn btn-primary" v-on:click='addImage'>Create</button>
                  <button v-else type="button" style='float:right' id='save' class="btn btn-primary" disabled>Create</button>
                  <button type="button" style='float:right; display: none' id='saveTechnicalExists' class="btn btn-primary" disabled>Create</button>
                  <div id='loader' style='display:none; text-align: center;'>
                    <img style="" id="loaderAddInstance" src="../assets/img/ajax-loader.gif" alt="Loading"/><br />
                    <span class="text-primary" id="messageLoaderAddInstance">This may take several minutes.</span>
                  </div>
                  <div id='errorLoader' style='display:none; text-align: center;'>
                    <span class="text-danger" id="errorLoaderAddInstance">An error [[ codeErrorPull ]] was received : [[ messageErrorPull ]].</span><br />
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

    methods : {


      displayFormAddImage : function (event) {
        document.getElementById('modal-add-image').style.display = 'block';
      },

      cancelAddImage : function (event) {
        document.getElementById('modal-add-image').style.display = 'none';
      },

      addImage : function (event) {
        this.imageName = document.getElementById('inputImageName').value;

        document.getElementById('save').style.display = 'none';
        document.getElementById('close_modal').style.display = 'none';
        document.getElementById('loader').style.display = 'block';

        var data = {
          'imageName' : this.imageName
        };

        this.$http.post('/-/v1/app', data).then(function (result) {
          if (result.status == 200) { location.reload(); }
        }, function (error) {
          if (error.status == 400) {
            this.codeErrorPull = error.status;
            this.messageErrorPull = error.data;
            document.getElementById('loader').style.display = 'none';
            document.getElementById('errorLoader').style.display = 'block';
          }
        });
      },

      tryAgain : function (event) {
        location.reload();
      }

    },


    data() {

      return {
        imageName : '',
        messageErrorPull : '',
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

</style>