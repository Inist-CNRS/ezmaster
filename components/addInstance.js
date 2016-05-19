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
			this.technicalName = $("#inputPart1").val() + '-' + $("#inputPart2").val() + '-' + $("#inputPart3").val();

  		var data = {
  			'title' : $("#inputTitle").val(),
  			'technicalName' :  this.technicalName,
  			'app' : $("#app").val()
  		}
  		this.$http.post('/-/v1/instances', data).then(function (result) {
  			location.reload();
  		}, console.error );
  	}
  },
  data : {
  	technicalName : '',
  }
})
