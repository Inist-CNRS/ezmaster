
<!--
  This is a .vue component divided into 3 parts :
  - <template> containing the HTML code of this component.
  - <script> containing the javascript code of this component.
  - <style> containing the CSS code of this component.
 -->

<template>

  <div id="addInstance" v-on:keyup.esc="cancelAddInstance">
    <button id="add_instance" class="btn btn-raised btn-primary" v-on:click="displayFormAddInstance" v-bind:disabled="fsIsAlmostFilled"><span data-toggle="tooltip" data-placement="right" :data-original-title="fsIsAlmostFilled ? 'File system almost full, please free disk space to be able to add an isntance.' : ''">Add Instance</span></button>

    <div class="modal" id="modal-add-instance">
      <div class="modal-dialog">
        <div class="modal-content">
          <form novalidate id="add-instance-form" name="Form" class="form-horizontal">
            <fieldset>
              <div class="modal-header modal-add-instance">
                <legend>
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="cancelAddInstance">×</button>
                  <span class="titleFormAddInstance">Add Instance</span>
                </legend>
              </div>
              <br />
              <div class="modal-body">
                <div class="form-group">
                  <label for="app" class="col-md-3 control-label">Application</label>

                  <div class="col-md-9">
                    <select id="app" class="form-control">
                        <option v-for="app in apps" :value='app.imageName'>{{ app.imageName }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group" :class="{ 'has-error': errors.has('inputLongName') }">
                  <label for="inputLongName" class="col-md-3 control-label">Long Name</label>
                  <div class="col-md-9">
                    <input class="form-control" id="inputLongName" name="Long Name" v-validate data-vv-rules="required" placeholder="A free text, human-readable." type="text" v-model="longName">
                  </div>
                </div>

                <div class="form-group" :class="{ 'has-error': errors.has('inputProject') || errors.has('inputStudy') || errors.has('inputVersion') }">
                  <label class="col-md-3 control-label">Technical Name</label>

                  <div class="col-md-9">
                    <div class="block-input">
                      <input class="form-control sizeInput" id="inputProject" name="project" v-validate data-vv-rules="required|alpha_num|lowercase" placeholder="project" type="text" v-model="project">-
                      <input class="form-control has-warning sizeInput" id="inputStudy" name="study" v-validate data-vv-rules="required|alpha_num|lowercase" placeholder="study" type="text" v-model="study">-
                      <input class="form-control sizeInput" id="inputVersion" name="version" v-validate data-vv-rules="numeric" placeholder="1" type="text" min='0' v-model="version">
                    </div>
                    <ul v-show="errors.any()" class="help-block text-danger">
                      <li v-for="error in errors.all()">{{ error }}</li>
                    </ul>
                    <span v-show="invalid" id='technicalNameExists' class="help-block text-danger">Technical name "{{ technicalName }}" already exists</span>
                  </div>
                </div>

                <div class="form-group" v-if="publicDomain != ''">
                  <label for="urlPreview" class="col-md-3 control-label">URL preview</label>
                  <div class="col-md-9">
                    <input class="form-control" id="urlPreview" placeholder='Generated URL' type="text" v-model='urlPreview' disabled>
                  </div>
                </div>
              </div>

              <div class="panel-footer">
                <button type="button" id="close_modal" class="btn btn-default" v-on:click='cancelAddInstance' data-dismiss="modal">Cancel</button>
                <button v-if="errors.any() || invalid || technicalName == ''" type="button" id='saveTechnicalExists' class="btn btn-primary button-create-disabled" disabled>Create</button>
                <button v-else                         type="button" id='save' class="btn btn-primary button-create" v-on:click='addInstance'>Create</button>
                <div id='loader' class="loader">
                  <img id="loaderAddInstance" src="/img/ajax-loader.gif" alt="Loading"/><br />
                  <span class="text-primary" id="messageLoaderAddInstance">This may take several minutes.</span>
                </div>
                <div id='errorLoader' class="loader">
                  <span class="text-danger" id="errorLoaderAddInstance">An error {{ codeErrorPull }} was received : {{ messageErrorPull }}.</span><br />
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
  var socket = io();

  var publicDomain;

  export default {

    mounted () {
      var self = this;

      // enables the bootstrap component for tooltips
      $('#addInstance [data-toggle="tooltip"]').tooltip();

      self.$http.get('/-/v1/config').then(function (result) {
        var config = result.data;
        self.publicDomain = config.publicDomain;
        publicDomain = config.publicDomain;
      }, console.error);

      self.$http.get('/-/v1/app').then(result => {
        self.apps = result.data.sort((app1, app2) => {
          if (app1.imageName === app2.imageName) {
            return 0;
          }
          return app1.imageName > app2.imageName ? -1 : 1;
        });
      }, console.error);

      this.$watch('study', function (study) {
        // The study parameter contains the study field value.

        this.study = study;

        if (this.version === '') { this.technicalName = this.project + '-' + this.study; }
        else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

        this.verif(this.technicalName);
      });

      this.$watch('project', function (project) {
        // The project parameter contains the project field value.

        this.project = project;

        if (this.version === '') { this.technicalName = this.project + '-' + this.study; }
        else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

        this.verif(this.technicalName);
      });

      this.$watch('version', function (version) {
        // The version parameter contains the version field value.

        this.version = version;

        if (this.version === '') { this.technicalName = this.project + '-' + this.study; }
        else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

        this.verif(this.technicalName);
      });

      socket.on('refreshInfosMachine', function (infosMachineSocket) {
        self.fsIsAlmostFilled = infosMachineSocket.fsIsAlmostFilled;
      });
    },

    methods: {

      verif: function (technicalName) {
        var self = this;
        this.$http.get('/-/v1/instances/verif/' + technicalName).then(function (result) {
          if (result.data === 'OK') {
            self.invalid = false;
          }
          else {
            self.invalid = true;
          }
        });
      },

      displayFormAddInstance: function (event) {
        document.getElementById('modal-add-instance').style.display = 'block';
      },

      cancelAddInstance: function (event) {
        document.getElementById('modal-add-instance').style.display = 'none';
      },

      addInstance: function (event) {
        this.longName = document.getElementById('inputLongName').value;
        this.project = document.getElementById('inputProject').value;
        this.study = document.getElementById('inputStudy').value;
        this.version = document.getElementById('inputVersion').value;

        document.getElementById('save').style.display = 'none';
        document.getElementById('close_modal').style.display = 'none';
        document.getElementById('loader').style.display = 'block';

        if (this.longName === '') { this.longName = 'Free comment of ' + this.technicalName; }

        var data = {
          longName: this.longName,
          project: this.project,
          version: this.version,
          study: this.study,
          technicalName: this.technicalName,
          app: document.getElementById('app').value
        };
        this.$http.post('/-/v1/instances', data).then(function (result) {
          if (result.status === 200) { location.reload(); }
        }, function (error) {
          this.codeErrorPull = error.status;
          this.messageErrorPull = error.data;
          document.getElementById('loader').style.display = 'none';
          document.getElementById('errorLoader').style.display = 'block';
        });
      },

      tryAgain: function (event) {
        location.reload();
      }

    },

    data () {
      return {
        longName: '',
        project: '',
        version: '',
        study: '',
        technicalName: '',
        urlPreview: '',
        messageErrorPull: '',
        publicDomain: '',
        apps: [],
        codeErrorPull: '',
        invalid: false,
        fsIsAlmostFilled: true
      };
    },

    computed: { // Here we manage fields built from other ones.

      urlPreview: function () {
        // By return we update what is present in the urlPreview field.
        // So, the content of the urlPreview field will be :
        // 'http://'+this.technicalName+'.'+publicDomain
        return 'http://' + this.technicalName + '.' + publicDomain;
      }

    }

  };

</script>



<style scoped>

  #add_instance {
    margin-left: 2.5%;
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

  #save, #saveTechnicalExists {
      background-color:#0277BD;
  }

  .button-create{
    float:right;
  }

  .titleFormAddInstance {
      color:white;
  }

  .modal-add-instance{
    background-color: #0277BD;
    border:solid white 5px;
  }

  .button-create-disabled{
    float:right;
    /* display: none; */
  }

  .loader{
    display: none;
    text-align: center;
  }
</style>
