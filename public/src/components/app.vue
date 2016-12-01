<template>
    <div>
      <nav class="navbar navbar-default navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#" data-toggle="tab">EzMaster</a>
          </div>
          <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
              <li class="nav-item active">
        <a data-toggle="tab" class="nav-link" href="#instances">Instances</a>
        </li>
              <li class="nav-item">
          <a data-toggle="tab" class="nav-link" href="#apps">Applications</a>
        </li>
            </ul>
            <InfosMachine></InfosMachine>
          </div>
        </div>
      </nav>
      <div class="tab-content">
        <div id="instances" class="tab-pane fade in active">
          <Instances></Instances>
          <AddInstance></AddInstance>
        </div>
        <div id="apps" class="tab-pane fade">
          <Applications ref="appslist"></Applications>
          <AddApp ref="addapps"></AddApp>
        </div>
      </div>
          </div>
</template>

<script>
import InfosMachine from './infos-machine-table.vue';
import Instances from './table.vue';
import AddInstance from './add-instance.vue';
import AddApp from './add-apps.vue';
import Applications from './applications.vue';

export default {
  mounted: function () {
    const self = this;
    self.$refs.addapps.$on('refreshApplicationsList', function (msg) {
      self.$refs.appslist.refresh();
    });
  },
  components: {
    InfosMachine,
    Instances,
    AddInstance,
    Applications,
    AddApp
  }
};
</script>
<style>
.mainbar {
  background-color: #0277BD;
}
</style>
