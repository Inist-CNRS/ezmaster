<template>
  <!-- Modal for instance configuration -->
  <div class="modal" style="display: block;" v-bind:class="{ 'modal-fullscreen': fullscreen }" id="modal-update-config">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true" v-on:click="closeModal">
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </button>
          <button type="button" class="fs-button close" aria-hidden="true" v-on:click="toggleFullscreen">
            <span class="glyphicon" v-bind:class="{ 'glyphicon-resize-small': fullscreen, 'glyphicon-resize-full': !fullscreen }" aria-hidden="true"></span>
          </button>
          <h4 class="modal-title">Configuration</h4>
        </div>

        <div class="modal-body">
          <div id="jsoneditor" ref="jsoneditor"></div>
          <span id="spanConfigError" class="text-danger"></span>
        </div>

        <div class="modal-footer">
          <a class="btn btn-default" v-on:click="closeModal" data-dismiss="modal">Cancel</a>
          <a id="buttonUpdate" class="btn btn-info button-right" :disabled="jsonError" v-on:click="updateConfig">Update</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* global JSONEditor */

  let editor;

  export default {
    props: ['instanceId'],
    data () {
      return {
        jsonError: null,
        fullscreen: false,
        updating: false
      };
    },
    created: function () {
      this.$http.get(`/-/v1/instances/${this.instanceId}`).then(result => {
        editor = new JSONEditor(this.$refs.jsoneditor, {
          mode: 'code',
          onChange: () => {
            try {
              editor.get();
              this.jsonError = null;
            }
            catch (e) {
              this.jsonError = e;
            }
          }
        });

        editor.set(result.data.config);
      });
    },
    methods: {
      closeModal: function () {
        this.$emit('close');
      },

      toggleFullscreen: function () {
        this.fullscreen = !this.fullscreen;
      },

      updateConfig: function () {
        const newConfig = editor.get();
        const data = {
          newConfig: newConfig,
          newTitle: newConfig.title
        };

        this.updating = true;

        this.$http.put(`/-/v1/instances/config/${this.instanceId}`, data).then(result => {
          this.updating = false;
          this.closeModal();
        });
      }
    }
  };

</script>

<style>
  #jsoneditor {
    width: 100%;
    height: 450px;
  }
  .modal-fullscreen .modal-dialog {
    margin: 0;
    margin-right: auto;
    margin-left: auto;
    width: 100%;
    max-width: 1024;
  }
  .modal-fullscreen .panel-footer {
    padding: 0;
  }
  .modal-fullscreen .panel-body {
    padding: 0;
  }
  .modal-fullscreen #jsoneditor {
    height: calc(100vh - 100px);
  }
</style>
