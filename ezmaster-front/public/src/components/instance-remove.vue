<template>
  <!-- Modal for instance deletion -->
  <div class="fade modal" tabindex="-1" role="dialog" ref="modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Are you sure ?</h4>
        </div>

        <div class="modal-body">
          <p>You are going to delete the <span class="text-warning">{{ instanceName }}</span> instance.</p>
          <p>It represents <i v-if="fetching" class="fa fa-circle-o-notch fa-spin fa-fw"></i> <span v-else class="text-warning">{{ instanceSize }}</span> of data.</p>
        </div>

        <div class="modal-footer">
          <a class="btn btn-default" data-dismiss="modal">Cancel</a>
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
  import eventHub from './event-hub.js';

  export default {
    data () {
      return {
        fetching: false,
        deleting: false,
        instanceSize: null,
        instanceName: null,
        instance: null
      };
    },
    mounted () {
      $(this.$refs.modal).on('show.bs.modal', e => {
        this.fetchSize();
      });

      eventHub.$on('openDeletePrompt', instance => {
        this.instance = instance;
        this.instanceName = instance.technicalName;
        this.show();
      });
    },
    methods: {
      show () { $(this.$refs.modal).modal('show'); },
      hide () { $(this.$refs.modal).modal('hide'); },

      fetchSize () {
        this.fetching = true;

        this.$http.get(`${this.Store.ezMasterAPI}/-/v1/instances/${this.instance.containerId}`).then(result => {
          this.instanceSize = result.data.size;

          this.fetching = false;
        }).catch(e => {
          this.fetching = false;
          console.error(e);
        });
      },

      deleteInstance () {
        this.deleting = true;

        this.$http.delete(`${this.Store.ezMasterAPI}/-/v1/instances/${this.instance.containerId}`).then(result => {
          this.deleting = false;
          this.hide();
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
</style>
