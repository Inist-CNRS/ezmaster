'use strict';

var vm = new Vue({
  el: '#addInstance',
  methods : {
  	displayFormAddInstance : function (event) {
      document.getElementById("modal-add-instance").style.display = "block";
  	},

  	cancelAddInstance : function (event) {
  		document.getElementById("modal-add-instance").style.display = "none";
  	},

  	addInstance : function (event) {
  		this.title = document.getElementById("inputTitle").value;
  		this.project = document.getElementById("inputProject").value;
  		this.study = document.getElementById("inputStudy").value;
  		this.version = document.getElementById("inputVersion").value;
			this.technicalName = this.project + '-' + this.study + '-' + this.version;

			document.getElementById("save").style.display = "none";
			document.getElementById("close_modal").style.display = "none";
			document.getElementById("loader").style.display = "block";

  		var data = {
  			'title' : this.title,
  			'project' : this.project,
  			'version' : this.version,
  			'study': this.study,
  			'technicalName' :  this.technicalName,
  			'app' : document.getElementById("app").value
  		}
  		this.$http.post('/-/v1/instances', data).then(function (result) {
  			if (result.status == 200) { location.reload(); }
  		}, function (error) {
        if(error.status == 400 && error.data == 'Error during pull') {
          document.getElementById("loader").style.display = 'none';
          document.getElementById("errorLoader").style.display = 'block';
        }
      });
  	},

    tryAgain : function (event) {
      location.reload();
    }
  },
  data : {
  	title : '',
  	project: '',
  	version : '',
  	study : '',
  	technicalName : ''
  }
});

module.exports = vm;

vm.$watch('project', function(data) {
  this.project = data;
  this.technicalName = data + '-' + this.study + '-' + this.version;
  verif(this.technicalName);
});

vm.$watch('study', function (data) {
  this.study = data;
  this.technicalName = this.project + '-' + data + '-' + this.version;
  verif(this.technicalName);
});

vm.$watch('version', function (data) {
  this.version = data;
  this.technicalName = this.project + '-' + this.study + '-' + data;
  verif(this.technicalName);
});

function verif (tn) {
  var data = {
    'technicalName' : tn
  }
  vm.$http.get('/-/v1/instances/verif', data).then(function (result) {
    if (result.status == 200) {  
       document.getElementById("technicalNameExists").style.display = "none";
    }
  }, function (error) {
    if(error.status == 409) { 
      document.getElementById("technicalNameExists").style.display = "block";
      $("#save").prop("disabled", true);
    }
  });
}