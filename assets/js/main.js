/* global $, document, JSONEditor, nColumns, view */
(function() { 'use strict';

  var $ = require('jquery')
    , Docker = require('dockerode')
    , docker = new Docker({ socketPath: '/var/run/docker.sock' })
    , ezmaster  = { modules : {} };

	ezmaster.modules.actions = (function() {

	  return {
      start : function(id) {
        $.ajax({
         url: '/-/start',
         data: {
            info: 'Container start',
            containerId : id
         },
         dataType: 'jsonp',
         type: 'POST',
         success : function(port) {
          var replace = '<a target="ezmaster" class="publicLink" href="http://127.0.0.1:' + port + ' ">' +
                        '<img src="/assets/img/publicLink.png" alt="Open the public link"></a>';
          $('.publicLink').replaceWith(replace);
         }
        });

        /*
        *
        To execute according to the status in .json
        *
        */      
        $('#status').css('background-color','#4CAF50');

        /*
        * NEED TO MODIFY THE PORT
        */
        var replace = '<a target="ezmaster" class="publicLink" href="http://127.0.0.1:3001">' +
                      '<img src="/assets/img/publicLink.png" alt="Open the public link"></a>';
        $('.publicLink').replaceWith(replace);
      },

      stop : function(id) {
        $.ajax({
          url : '/-/stop',
          data: {
            info : 'Container stop',
            containerId : id
          },
          dataType: 'jsonp',
          type: 'POST'
        });
        
        /*
        *
        To execute according to the status in .json
        *
        */      
        $('#status').css('background-color','#f44336');

        var replace = '<a class="publicLink" href="#"><img src="/assets/img/publicLink.png" alt="Open the public link"></a>';
        $('.publicLink').replaceWith(replace);
      },

      showDeleteModal : function() {
        $('#modal-delete-instance').fadeToggle(500);
      },

      closeDeleteModal : function() {
        $('#modal-delete-instance').fadeToggle(250);
      },

      delete : function(id) {
        $.ajax({
          url : '/-/delete',
          data: {
            /*info : 'Container deleted',
            containerId : id*/
          },
          dataType: 'jsonp',
          type: 'POST'
        });
      },

      // id recovered with line (ul on template.html) id (container id) 
      init : function () {
        $('.start').click(function() {
        	 ezmaster.modules.actions.start($(this).parent().attr('id'));
        });

        $('.stop').click(function() {
        	 ezmaster.modules.actions.stop($(this).parent().attr('id'));
        });

        $('.delete').click(ezmaster.modules.actions.showDeleteModal);
        $('.close_modal_delete_instance').click(ezmaster.modules.actions.closeDeleteModal);
        $('#delete_instance').click(function() {
        	 ezmaster.modules.actions.delete($(this).parent().attr('id'));
        });
      }
	  }
	}) ();

	ezmaster.modules.addInstance = (function() {
		return {
			/*showModal : function() {
				$('#modalForm').fadeToggle(500);
			},

			closeModal : function() {
				$('#modalForm').fadeToggle(250);
			},*/

			save : function() {
				/*if(title == '' || technicalName == '') {
					window.alert('Please fill all fields');
				}
				else {*/
          $.ajax({
            url : '/-/addInstance',
            /*data: {
              instanceTitle : title,
            },
            dataType: 'jsonp',*/
            type: 'POST',
            success : function() {
              location.reload();
            }
          });
					/*ezmaster.modules.addInstance.closeModal();*/
			},

			init : function() {
				$('#add_instance').click(ezmaster.modules.addInstance.save);
				/*$('#close_modal').click(ezmaster.modules.addInstance.closeModal);
				$('#save').click(ezmaster.modules.addInstance.save);
        $('#save').click(function() { 
          ezmaster.modules.addInstance.save($('#inputTitle').val(), $('#inputTechnicalName').val(), $('#app').val());
        });*/
      }
		}
	}) ();

  $(document).ready(function() {
    ezmaster.modules.actions.init();
    ezmaster.modules.addInstance.init();
  });

}());