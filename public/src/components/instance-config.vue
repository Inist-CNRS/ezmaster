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
          <h4 class="modal-title">Configuration {{instance.technicalName}}<i v-show="refreshing" class="fa fa-refresh fa-spin fa-fw"></i></h4>
        </div>

        <div class="modal-body">
          <div id="jsoneditor" ref="jsoneditor"></div>
          <span id="spanConfigError" class="text-danger"></span>
        </div>

        <div class="modal-footer">
          <a class="btn btn-default" v-on:click="closeModal" data-dismiss="modal">Cancel</a>
          <a id="buttonUpdate" class="btn btn-info" :disabled="jsonError || updating" v-on:click="updateConfig">
            <i v-if="updating" class="fa fa-circle-o-notch fa-spin fa-fw"></i>
            <span v-else>Update</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* global JSONEditor */

  let editor;

  export default {
    props: ['instance'],
    data () {
      return {
        jsonError: null,
        fullscreen: false,
        updating: false,
        refreshing: false
      };
    },
    created: function () {
      this.refreshConfig();
    },
    methods: {
      closeModal: function () {
        this.$emit('close');
      },

      toggleFullscreen: function () {
        this.fullscreen = !this.fullscreen;

        // resize the jsoneditor to take all the available space
        this.$nextTick(function () {
          editor.resize();
        });
      },

      refreshConfig: function () {
        var self = this;
        self.refreshing = true;

        self.$http.get(`/-/v1/instances/${self.instance.containerId}`).then(result => {
          editor = new JSONEditor(self.$refs.jsoneditor, {
            mode: 'code',
            onChange: () => {
              try {
                editor.get();
                self.jsonError = null;
              }
              catch (e) {
                self.jsonError = e;
              }
            }
          });

          self.refreshing = false;
          editor.set(result.data.config);
        }).catch(e => {
          self.refreshing = false;
        });
      },

      updateConfig: function () {
        const newConfig = editor.get();
        const data = {
          newConfig: newConfig,
          newTitle: newConfig.title
        };

        this.updating = true;

        this.$http.put(`/-/v1/instances/config/${this.instance.containerId}`, data).then(result => {
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
