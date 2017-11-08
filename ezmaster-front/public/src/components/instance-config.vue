<template>
  <!-- Modal for instance configuration -->
  <div class="fade modal" tabindex="-1" role="dialog" ref="modal">
    <div class="modal-dialog modal-lg" role="document" v-bind:class="{ 'modal-fullscreen': fullscreen }">
      <div class="modal-content">

        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </button>
          <button type="button" class="fs-button close" aria-hidden="true" v-on:click="toggleFullscreen">
            <span class="glyphicon" v-bind:class="{ 'glyphicon-resize-small': fullscreen, 'glyphicon-resize-full': !fullscreen }" aria-hidden="true"></span>
          </button>
          <h4 class="modal-title">Configuration of <span v-if="instance">{{ instance.technicalName }}</span> <i v-show="refreshing" class="fa fa-refresh fa-spin fa-fw"></i></h4>
        </div>

        <div class="modal-body">
          <div id="jsoneditor" ref="jsoneditor"></div>
          <span id="spanConfigError" class="text-danger"></span>
        </div>

        <div class="modal-footer">
          <a class="btn btn-default" data-dismiss="modal">Cancel</a>
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

  import eventHub from './event-hub.js';
  import Store from './store.js';

  let editor;

  export default {
    data () {
      return {
        Store,
        jsonError: null,
        fullscreen: false,
        updating: false,
        refreshing: false,
        instance: null
      };
    },
    mounted () {
      eventHub.$on('openConfig', instance => {
        this.instance = instance;
        this.instance.jsonEditorMode =
          (!this.instance.configType || this.instance.configType === 'json')
          ? 'code'
          : 'text';
        editor.setMode(this.instance.jsonEditorMode);
        this.refreshConfig(this.instance.jsonEditorMode);
        this.show();
      });

      // https://github.com/josdejong/jsoneditor/blob/master/docs/api.md
      editor = new JSONEditor(this.$refs.jsoneditor, {
        mode: 'code', // code or text but will be updated by this.instance.jsonEditorMode
        onChange: () => {
          try {
            if (this.instance.jsonEditorMode === 'text') {
              editor.getText();
            }
            else {
              editor.get();
            }
            this.jsonError = null;
          }
          catch (e) {
            this.jsonError = e;
          }
        }
      });
    },
    methods: {
      show () { $(this.$refs.modal).modal('show'); },
      hide () { $(this.$refs.modal).modal('hide'); },

      toggleFullscreen () {
        this.fullscreen = !this.fullscreen;

        // resize the jsoneditor to take all the available space
        this.$nextTick(function () {
          editor.resize();
        });
      },

      refreshConfig () {
        this.refreshing = true;
        editor.set('loading configuration...');
        this.$http.get(
          `${this.Store.ezMasterAPI}/-/v1/instances/${this.instance.containerId}`
        ).then(result => {
          this.refreshing = false;
          editor.setText(result.data.config);
        }).catch(e => {
          this.refreshing = false;
        });
      },

      updateConfig () {
        const newConfig = this.instance.jsonEditorMode === 'code' ? editor.get() : editor.getText();
        const data = {
          newConfig: newConfig,
          newTitle: newConfig.title
        };

        this.updating = true;

        this.$http.put(
          `${this.Store.ezMasterAPI}/-/v1/instances/config/${this.instance.containerId}`, data
        ).then(result => {
          this.updating = false;
          this.hide();
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
  .modal-dialog.modal-fullscreen {
    margin: 0;
    margin-right: auto;
    margin-left: auto;
    width: 100%;
  }
  .modal-fullscreen #jsoneditor {
    height: calc(100vh - 180px);
  }
</style>
