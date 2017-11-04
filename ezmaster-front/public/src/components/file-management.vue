<template>
  <!-- Modal Show Upload Data Files -->
  <div class="fade modal" tabindex="-1" role="dialog" ref="modal">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Instance files</h4>
        </div>

        <div class="modal-body">

          <!-- File upload -->
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">File upload</h3>
            </div>
            <div class="panel-body">
              <form v-on:submit.prevent="uploadFiles" class="form-inline">
                <label class="btn btn-success">
                  Select files <input type="file" name="files" ref="fileInput" style="display: none" required multiple @change="onChangeInputFile">
                </label>
                <input type="submit" value="Upload" class="btn btn-info" :disabled="!formFiles.length || uploading || freeSpaceExceeded">

                <div class="progress" v-if="uploading">
                  <div class="progress-bar progress-bar-striped active" role="progressbar" :style="{ width: progress + '%' }"></div>
                </div>

                <div v-show="formFiles.length">
                  <ul>
                    <li v-for="file in formFiles">{{ file.name }} ({{ file.size | toBytes }})</li>
                  </ul>

                  <div><strong>Total size:</strong> {{ totalSize | toBytes }}</div>

                  <div v-show="freeSpaceExceeded" class="alert alert-warning" role="alert">
                    Insufficient disk space: only {{ freeSpace | toBytes }} remaining.
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- File list -->
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">{{ files.length }} Data file(s) <i v-show="refreshing" class="fa fa-refresh fa-spin fa-fw"></i></h3>
            </div>
            <div class="panel-body">

              <div class="button-refresh">
                <input type="button" value="Refresh List" class="btn btn-info" v-on:click="refreshFileList">
              </div>

              <div id="filesList">
                <table id="data-files-table" class="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="file in files">
                        <tr>
                          <td class="files-list-name-column"><a :href="ezMasterAPI + '/-/v1/instances/' + instance.containerId + '/data/' + file.name">{{ file.name }}</a></td>
                          <td>{{ file.size }}</td>
                          <td>{{ file.mimeType }}</td>
                          <td>
                            <input type="button" value="Delete" class="btn btn-xs btn-danger" v-on:click="deleteFile(file.name)">
                          </td>
                        </tr>
                      </template>
                    </tbody>
                </table>
              </div>
            </div>
          </div>
		  <div>
			  <i class="fa fa-info-circle" aria-hidden="true"></i> You can also try to use <a :href="'dav://' + hostname  + '/wd--' + instance.technicalName ">Webdav URL</a>
		  </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal" aria-label="Close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import eventHub from './event-hub.js';
  import Store from './store.js';

  export default {
    data () {
      return {
        Store,
        freeSpaceExceeded: false,
        uploading: false,
        refreshing: false,
        progress: 0,
        totalSize: 0,
        freeSpace: 0,
        formFiles: [],
        files: [],
        instance: { technicalName: null },
        hostname: window.location.host
      };
    },
    filters: {
      toBytes: function (value) {
        if (typeof value !== 'number') { return 'N/A'; }

        if (value < 1024 * 1024) {
          return (Math.round(value * 100 / 1024) / 100).toString() + ' KB';
        }
        else if (value < 1024 * 1024 * 1024) {
          return (Math.round(value * 100 / (1024 * 1024)) / 100).toString() + ' MB';
        }

        return (Math.round(value * 100 / (1024 * 1024 * 1024)) / 100).toString() + ' GB';
      }
    },
    mounted () {
      this.ezMasterAPI = this.Store.ezMasterAPI;

      $(this.$refs.modal).on('show.bs.modal', e => {
        this.clearFileInput();
        this.refreshFileList();
      });

      eventHub.$on('openFileManagement', instance => {
        this.instance = instance;
        this.show();
      });
    },
    methods: {
      show () { $(this.$refs.modal).modal('show'); },
      hide () { $(this.$refs.modal).modal('hide'); },
      clearFileInput () {
        this.$refs.fileInput.value = '';
      },
      onChangeInputFile () {
        // When the user choose a file.

        this.freeSpaceExceeded = false;

        // Get information on total size allowed and free disk space.
        // Warn the user if a problem appears.
        this.$http.get(this.Store.ezMasterAPI + '/-/v1').then(result => {
          // We calculate the total size of selected files.

          this.totalSize = 0;
          this.freeSpace = result.data.freeDiskSpace;
          this.formFiles = this.$refs.fileInput.files;

          if (this.formFiles.length === 0) { return; }

          for (var i = 0; i < this.formFiles.length; i++) {
            this.totalSize += this.formFiles[i].size;
          }

          // Is there enough space remaining ?
          this.freeSpaceExceeded = (this.totalSize >= this.freeSpace);
        });
      },

      uploadFiles () {
        if (!this.formFiles.length || this.freeSpaceExceeded) { return; }

        const url = `${this.Store.ezMasterAPI}/-/v1/instances/${this.instance.containerId}/data/`;
        const form = new FormData();

        for (let i = 0; i < this.formFiles.length; i++) {
          form.append('files[]', this.formFiles[i]);
        }

        this.uploading = true;
        this.progress = 0;

        this.$http.post(url, form, {
          progress: (e) => {
            if (e.lengthComputable) {
              this.progress = Math.floor(e.loaded / e.total * 100);
            }
          }
        }).then(response => {
          this.uploading = false;
          this.clearFileInput();
          this.refreshFileList();
        }).catch(e => {
          this.uploading = false;
          this.refreshFileList();
        });
      },

      deleteFile (fileName) {
        // Delete the file.
        this.$http.delete(`${this.Store.ezMasterAPI}/-/v1/instances/${this.instance.containerId}/${fileName}`)
        .then(this.refreshFileList)
        .catch(e => {
          console.error(e);
          this.refreshFileList();
        });
      },

      refreshFileList () {
        this.files = [];
        this.refreshing = true;

        // Get information on formerly uploaded files for the concerned instance.
        this.$http.get(`${this.Store.ezMasterAPI}/-/v1/instances/${this.instance.containerId}/data`).then(result => {
          for (const filename in result.data) {
            this.files.push(result.data[filename]);
          }
          this.refreshing = false;
        }).catch(e => {
          console.error(e);
          this.refreshing = false;
        });
      }
    }
  };

</script>

<style>
</style>
