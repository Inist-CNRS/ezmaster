'use strict';

module.exports = new Vue({
  el: '#addInstance',
  methods : {
  	displayFormAddInstance : function (event) {
			$('#modal-add-instance').show();
  	},

  	cancelAddInstance : function (event) {
  		$('#modal-add-instance').hide();
  	},

  	addInstance : function (event) {
  		this.title = $("#inputTitle").val();
  		this.project = $("#inputProject").val();
  		this.study = $("#inputStudy").val();
  		this.version = $("#inputVersion").val();
			this.technicalName = $("#inputProject").val() + '-' + $("#inputStudy").val() + '-' + $("#inputVersion").val();

			$("#save").hide();
			$("#close_modal").hide();
			$("#loaderAddInstance").show();

  		var data = {
  			'title' : this.title,
  			'project' : this.project,
  			'version' : this.version,
  			'study': this.study,
  			'technicalName' :  this.technicalName,
  			'app' : $("#app").val()
  		}
  		this.$http.post('/-/v1/instances', data).then(function (result) {
  			if (result.data.status == 'noExists') { location.reload(); }
  			else if (result.data.status == 'exists') { 
  				$("#technicalNameExists").show();
  			}
  		}, console.error );
  	}
  },
  data : {
  	title : '',
  	project: '',
  	version : '',
  	study : '',
  	technicalName : ''
  }
})
