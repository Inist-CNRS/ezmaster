<template>
  <!-- Modal for instance deletion -->
  <div class="modal" style="display: block;" id="modal-delete-instance">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" v-on:click="closeModal">&times;</span></button>
          <h4 class="modal-title">Are you sure ?</h4>
        </div>

        <div class="modal-body">
          <p>You are going to delete the <span class="text-warning">{{ instance.technicalName }}</span> instance.</p>
          <p>It represents <i v-if="fetching" class="fa fa-circle-o-notch fa-spin fa-fw"></i> <span v-else class="text-warning">{{ instanceSize }}</span> of data.</p>
        </div>

        <div class="modal-footer">
          <a class="btn btn-default" v-on:click="closeModal" data-dismiss="modal">Cancel</a>
          <a class="btn btn-warning" :disabled="deleting" v-on:click="deleteInstance">
            <i v-if="deleting" class="fa fa-circle-o-notch fa-spin fa-fw"></i>
            <span v-else>Delete</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['instance'],
    data () {
      return {
        fetching: false,
        deleting: false,
        instanceSize: null
      };
    },
    created: function () {
      this.fetchSize();
    },
    methods: {
      closeModal: function () {
        this.$emit('close');
      },

      fetchSize: function () {
        this.fetching = true;

        this.$http.get(`/-/v1/instances/${this.instance.containerId}`).then(result => {
          this.instanceSize = result.data.size;

          this.fetching = false;
        }).catch(e => {
          this.fetching = false;
          console.error(e);
        });
      },

      deleteInstance: function () {
        this.deleting = true;

        this.$http.delete(`/-/v1/instances/${this.instance.containerId}`).then(result => {
          this.deleting = false;
          this.closeModal();
          this.$emit('instance-deleted', this.instance.technicalName);
        }).catch(e => {
          this.deleting = false;
          console.error(e);
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
