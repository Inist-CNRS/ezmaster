/* global Vue, global document, global location*/
'use strict';

var vm = new Vue({
  el: '#addInstance',

  self.$http.get('/-/v3/config.js').then(function (result) {
    self.$set('publicDomain', result.data.publicDomain);
  }, console.error);


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


// Manage field color changes in the addInstance form.

vm.$watch('longName', function(data) {

  var value = document.forms['Form']['inputLongName'].value;

  if (value == '')
    document.getElementById('inputLongName').style.backgroundColor='#FFCDD2';
  else
    document.getElementById('inputLongName').style.backgroundColor='#C5E1A5';

});


vm.$watch('study', function(data) {

  var value = document.forms['Form']['inputStudy'].value;

  if (/^[a-z0-9]+$/.test(value)==false || value == '')
    document.getElementById('inputStudy').style.backgroundColor='#FFCDD2';
  else
    document.getElementById('inputStudy').style.backgroundColor='#C5E1A5';

});


vm.$watch('project', function(data) {

  var value = document.forms['Form']['inputProject'].value;

  if (/^[a-z0-9]+$/.test(value)==false || value == '')
    document.getElementById('inputProject').style.backgroundColor='#FFCDD2';
  else
    document.getElementById('inputProject').style.backgroundColor='#C5E1A5';

});



vm.$watch('project', function(data) {
  this.project = data;

  if (this.version == '') { this.technicalName = this.project + '-' + this.study; }
  else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

  this.urlPreview = 'http://'+this.technicalName;
  verif(this.technicalName);
});

vm.$watch('study', function (data) {
  this.study = data;

  if (this.version == '') { this.technicalName = this.project + '-' + this.study; }
  else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

  this.urlPreview = 'http://'+this.technicalName;
  verif(this.technicalName);
});

vm.$watch('version', function (data) {
  this.version = data;

  if (this.version == '') { this.technicalName = this.project + '-' + this.study; }
  else { this.technicalName = this.project + '-' + this.study + '-' + this.version; }

  this.urlPreview = 'http://'+this.technicalName;
  verif(this.technicalName);
});

function verif (tn) {
  var data = {
    'technicalName' : tn
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
}