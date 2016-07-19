
/* global Vue, global document, global location*/

'use strict';

var publicDomain;

var vm = new Vue({

  el: '#addInstance',

  ready : function () {

    var self = this;

    self.$http.get('/-/v3/config.js').then(function (result) {
      self.$set('publicDomain', result.data.publicDomain);
      publicDomain = result.data.publicDomain;
    }, console.error);
  },


  methods : {

    verif : function (technicalName) {

      var data = {
        'technicalName' : technicalName
      };

      vm.$http.get('/-/v1/instances/verif', data).then(function (result) {

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
  data : {
    longName : '',
    project: '',
    version : '',
    study : '',
    technicalName : '',
    urlPreview : '',
    messageErrorPull : '',
    codeErrorPull : ''
  }

});


module.exports = vm;


// The 3 first vm.$watch manage field color changes in the addInstance form.

vm.$watch('longName', function(longName) {

  // The longName parameter contains the longName field value.

  if (longName == '')
    document.getElementById('inputLongName').style.backgroundColor='#FFCDD2';
  else
    document.getElementById('inputLongName').style.backgroundColor='#C5E1A5';

});


vm.$watch('study', function(study) {

  // The study parameter contains the study field value.

  if (/^[a-z0-9]+$/.test(study)==false || study == '')
    document.getElementById('inputStudy').style.backgroundColor='#FFCDD2';
  else
    document.getElementById('inputStudy').style.backgroundColor='#C5E1A5';

});


vm.$watch('project', function(project) {

  // The project parameter contains the project field value.

  if (/^[a-z0-9]+$/.test(project)==false || project == '')
    document.getElementById('inputProject').style.backgroundColor='#FFCDD2';
  else
    document.getElementById('inputProject').style.backgroundColor='#C5E1A5';

});


vm.$watch('project', function(project) {

  // The project parameter contains the project field value.

  this.project = project;

  if (this.version == '') { this.technicalName = this.project + '-' + this.study; }
  else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

  this.urlPreview = 'http://'+this.technicalName+'.'+publicDomain;
  this.verif(this.technicalName);

});


vm.$watch('study', function (study) {

  // The study parameter contains the study field value.

  this.study = study;

  if (this.version == '') { this.technicalName = this.project + '-' + this.study; }
  else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

  this.urlPreview = 'http://'+this.technicalName+'.'+publicDomain;
  this.verif(this.technicalName);

});


vm.$watch('version', function (version) {

  // The version parameter contains the version field value.

  this.version = version;

  if (this.version == '') { this.technicalName = this.project + '-' + this.study; }
  else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

  this.urlPreview = 'http://'+this.technicalName+'.'+publicDomain;
  this.verif(this.technicalName);

});