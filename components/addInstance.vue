
<!--
  This is a .vue component divided into 3 parts :
  - <template> containing the HTML code of this component.
  - <script> containing the javascript code of this component.
  - <style> containing the CSS code of this component.
 -->

<template>

  <div id='addInstance' v-on:keyup.esc="cancelAddInstance">
    <button id="add_instance" class="btn btn-raised btn-primary" v-on:click="displayFormAddInstance" >Add an instance</button>

    <div class="modal" id="modal-add-instance">
      <div class="modal-dialog">
        <div class="modal-content">
          <validator name="validation1">
            <form novalidate id="add-instance-form" name="Form" class="form-horizontal">
              <fieldset>
                <div class="modal-header" style="background-color: #0277BD; border:solid white 5px;">
                  <legend>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelAddInstance">×</button>
                    <span class="titleFormAddInstance">Add an instance</span>
                  </legend>
                </div>
                <br />
                <div class="modal-body">
                  <div class="form-group">
                    <label for="app" class="col-md-3 control-label">App</label>

                    <div class="col-md-9">
                      <select id="app" class="form-control">
                          <option v-for="app in apps" value='[[ app ]]'>[[ app ]]</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="inputLongName" class="col-md-3 control-label">Long name</label>
                    <div class="col-md-9">
                      <input class="form-control" id="inputLongName" name="inputLongName" placeholder=" Ex : Title, Comment, Note, etc" type="text" value='[[ longName ]]' v-model="longName" v-validate:longName="{ required: true }">
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="col-md-3 control-label">Technical name</label>

                    <div class="col-md-9">
                      <div class="block-input">
                        <input class="form-control sizeInput" id="inputProject" name="inputProject" placeholder=" Ex : Project name" type="text" value='[[ project ]]' v-model="project" v-validate:project="{ required: true, lowercaseAndDigits : true}">-
                        <input class="form-control has-warning sizeInput" id="inputStudy" name="inputStudy" placeholder=" Ex : Study name" type="text" value='[[ study ]]' v-model="study" v-validate:study="{ required: true, lowercaseAndDigits : true }">-
                        <input class="form-control sizeInput" id="inputVersion" placeholder=" Version" value="[[ version ]]" type="text" min='0' v-model="version">
                      </div>
                      <div v-if='$validation1.project.dirty'>
                        <span class="help-block text-danger" v-if="$validation1.project.required">Fill the first part of the technical name.</span>
                        <span class="help-block text-danger" v-if="$validation1.project.lowercaseAndDigits">Only lower case letters and digits for the first part.</span>
                      </div>
                      <div v-if='$validation1.study.dirty'>
                        <span class="help-block text-danger" v-if="$validation1.study.required">Fill the second part of the technical name.</span>
                        <span class="help-block text-danger" v-if="$validation1.study.lowercaseAndDigits">Only lower case letters and digits for the second part.</span>
                      </div>
                      <span style='display: none' id='technicalNameExists' class="help-block text-danger">Technical name "[[ technicalName ]]" already exists</span>
                    </div>
                  </div>

                  <div class="form-group" v-if="[[ publicDomain ]] != ''">
                    <label for="urlPreview" class="col-md-3 control-label">URL preview</label>
                    <div class="col-md-9">
                      <input class="form-control" id="urlPreview" placeholder='Generated URL' type="text" value='[[ urlPreview ]]' v-model='urlPreview' disabled>
                    </div>
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
        self.$set('publicDomain', result.data.publicDomain);
        publicDomain = result.data.publicDomain;
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


      this.$watch('study', function(study) {

        // The study parameter contains the study field value.

        this.study = study;

        if (this.version == '') { this.technicalName = this.project + '-' + this.study; }
        else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

        this.verif(this.technicalName);


        if (/^[a-z0-9]+$/.test(study)==false || study == '') {
          // Red background.
          document.getElementById('inputStudy').style.backgroundColor='#FFCDD2';
        }
        else {
          // Green background.
          document.getElementById('inputStudy').style.backgroundColor='#C5E1A5';
        }

      });


      this.$watch('project', function(project) {

        // The project parameter contains the project field value.

        this.project = project;

        if (this.version == '') { this.technicalName = this.project + '-' + this.study; }
        else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

        this.verif(this.technicalName);


        if (/^[a-z0-9]+$/.test(project)==false || project == '') {
          // Red background.
          document.getElementById('inputProject').style.backgroundColor='#FFCDD2';
        }
        else {
          // Green background.
          document.getElementById('inputProject').style.backgroundColor='#C5E1A5';
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

      verif : function (technicalName) {

        var data = {
          'technicalName' : technicalName
        };

        this.$http.get('/-/v1/instances/verif', data).then(function (result) {

          if (result.status == 200) {
            document.getElementById('technicalNameExists').style.display = 'none';
            document.getElementById('save').style.display = 'block';
            document.getElementById('saveTechnicalExists').style.display = 'none';
          }

        }, function (error) {

          if (error.status == 409) {
            document.getElementById('technicalNameExists').style.display = 'block';
            document.getElementById('save').style.display = 'none';
            document.getElementById('saveTechnicalExists').style.display = 'block';
          }

        });

      },

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
        project: '',
        version : '',
        study : '',
        technicalName : '',
        urlPreview : '',
        messageErrorPull : '',
        publicDomain : '',
        apps : '',
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