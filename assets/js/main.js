/* global $, document, JSONEditor, nColumns, view */
(function() { 'use strict';

  var ezmaster  = { modules : {} };

	ezmaster.modules.actions = (function() {

	  return {
      start : function(id) {
        $.ajax({
          url: '/-/start',
            data: {
            containerId : id
          },
          type: 'POST',
          success : function () {
            location.reload();
          }
        });
      },

      stop : function (id) {
        $.ajax({
          url : '/-/stop',
          data: {
            containerId : id
          },
          type: 'POST',
          success : function () { 
            location.reload();
          }
        });
      },

      showDeleteModal : function(id) {
        $.ajax({
          url : '/-/deleteConfirmation',
          type : 'POST',
          data : {
            containerId : id
          },
          success : function (result) {
            $('.deleteConfirmationMessage').text("Are you sure to delete the instance called '" + result['title'] + "' ?");
            $('.deleteSizeFolder').text("You will remove " + result['size'] + " of datas.");
            $('#modal-delete-instance').fadeToggle(500);
          }
        });
      },

      closeDeleteModal : function() {
        $('#modal-delete-instance').fadeToggle(250);
      },

      delete : function (id) {
        $.ajax({
          url : '/-/delete',
          data: {
            containerId : id
          },
          type: 'POST',
          success : function () {
            location.reload();
          }
        });
      },
 
      init : function () {
        $('.start').click(function() {
        	 ezmaster.modules.actions.start($(this).parent().attr('id'));
        });

        $('.stop').click(function() {
        	 ezmaster.modules.actions.stop($(this).parent().attr('id'));
        });

        $('.delete').click(function() {
          ezmaster.modules.actions.showDeleteModal($(this).parent().attr('id'));
        });
        $('.close_modal_delete_instance').click(ezmaster.modules.actions.closeDeleteModal);
        $('#delete_instance').click(function() {
        	 ezmaster.modules.actions.delete($('.delete').parent().attr('id'));
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
