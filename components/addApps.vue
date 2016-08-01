
<!--
  This is a .vue component divided into 3 parts :
  - <template> containing the HTML code of this component.
  - <script> containing the javascript code of this component.
  - <style> containing the CSS code of this component.
 -->

<template>

  <div id='addInstance' v-on:keyup.esc="cancelAddInstance">
    <button id="add_instance" class="btn btn-raised btn-primary" v-on:click="displayFormAddInstance" >Add Instance</button>

    <div class="modal" id="modal-add-instance">
      <div class="modal-dialog">
        <div class="modal-content">
          <validator name="validation1">
            <form novalidate id="add-instance-form" name="Form" class="form-horizontal">
              <fieldset>
                <div class="modal-header" style="background-color: #0277BD; border:solid white 5px;">
                  <legend>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelAddInstance">×</button>
                    <span class="titleFormAddInstance">Add Instance</span>
                  </legend>
                </div>
                <br />
                <div class="modal-body">

                  <div class="form-group">
                    <label for="inputLongName" class="col-md-3 control-label">Application Name</label>
                    <div class="col-md-9">
                      <input class="form-control" id="inputLongName" name="inputLongName" placeholder=" Ex : Title - Comment - Note" type="text" value='[[ longName ]]' v-model="longName" v-validate:longName="{ required: true }">
                    </div>
                  </div>

                <div class="panel-footer">
                  <button type="button" id="close_modal" class="btn btn-default" v-on:click='cancelAddInstance' data-dismiss="modal">Cancel</button>
                  <button v-if="$validation1.valid" type="button" style='float:right' id='save' class="btn btn-primary" v-on:click='addInstance'>Create</button>
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

  var publicDomain;


  export default {

    ready () {

      var self = this;

      self.$http.get('/-/v3/config.js').then(function (result) {
        var config = JSON.parse(result.data);
        self.$set('publicDomain', config.publicDomain);
        publicDomain = config.publicDomain;
      }, console.error);

      self.$http.get('/-/v1/app').then(function (result) {
        self.$set('apps', result.data);
      }, console.error);


      this.$watch('longName', function(longName) {

        // The longName parameter contains the longName field value.

        if (longName == '') {
          // Red background.
          document.getElementById('inputLongName').style.backgroundColor='#FFCDD2';
        }
        else {
          // Green background.
          document.getElementById('inputLongName').style.backgroundColor='#C5E1A5';
        }

      });


      this.$watch('version', function (version) {

        // The version parameter contains the version field value.

        this.version = version;

        if (this.version == '') { this.technicalName = this.project + '-' + this.study; }
        else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

        this.verif(this.technicalName);

      });

    },


    methods : {


      displayFormAddInstance : function (event) {
        document.getElementById('modal-add-instance').style.display = 'block';
      },

      cancelAddInstance : function (event) {
        document.getElementById('modal-add-instance').style.display = 'none';
      },

      addInstance : function (event) {
        this.longName = document.getElementById('inputLongName').value;
        this.project = document.getElementById('inputProject').value;
        this.study = document.getElementById('inputStudy').value;
        this.version = document.getElementById('inputVersion').value;

        document.getElementById('save').style.display = 'none';
        document.getElementById('close_modal').style.display = 'none';
        document.getElementById('loader').style.display = 'block';

        if (this.longName == '') { this.longName = 'Free comment of '+this.technicalName; }

        var data = {
          'longName' : this.longName,
          'project' : this.project,
          'version' : this.version,
          'study': this.study,
          'technicalName' :  this.technicalName,
          'app' : document.getElementById('app').value
        };
        this.$http.post('/-/v1/instances', data).then(function (result) {
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
        longName : '',
        study : '',
        messageErrorPull : '',
        publicDomain : '',
        codeErrorPull : ''
      }

    },


    computed: { // Here we manage fields built from other ones.

      urlPreview: function () {

        // By return we update what is present in the urlPreview field.
        // So, the content of the urlPreview field will be :
        // 'http://'+this.technicalName+'.'+publicDomain
        return 'http://'+this.technicalName+'.'+publicDomain;

      }

    }

  }

</script>



<style>

  #add_instance {
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