
<!--
  This is a .vue component divided into 3 parts :
  - <template> containing the HTML code of this component.
  - <script> containing the javascript code of this component.
  - <style> containing the CSS code of this component.
 -->

<template>

  <!-- The navbar part displaying machine information. -->

  <div class="nav navbar-text navbar-right infoMachineGroup">

    <!-- LoadAverage -->
    <div class="infoMachineItem" data-toggle="tooltip" data-placement="bottom" :data-original-title="'Load average\n' + infosMachine.nbCPUs + 'CPUs'">
      <span class="glyphicon glyphicon-tasks" aria-hidden="true"></span>
    </div>
    <div class="infoMachineItem" data-toggle="tooltip" data-placement="bottom" data-original-title="Load average over 1 minutes">
      <span class="badge">{{ (infosMachine.loadAverage)[0] }}</span>
    </div>
    <div class="infoMachineItem" data-toggle="tooltip" data-placement="bottom" data-original-title="Load average over 5 minutes">
      <span class="badge">{{ (infosMachine.loadAverage)[1] }}</span>
    </div>
    <div class="infoMachineItem" data-toggle="tooltip" data-placement="bottom" data-original-title="Load average over 15 minutes">
      <span class="badge">{{ (infosMachine.loadAverage)[2] }}</span>
    </div>
    <!-- RAM -->
    <div class="infoMachineItem" data-toggle="tooltip" data-placement="bottom" data-original-title="RAM usage">
      <span  class="glyphicon glyphicon-oil" aria-hidden="true"></span>
    </div>
    <div class="infoMachineItem" data-toggle="tooltip" data-placement="bottom" :data-original-title="'RAM\nTotal : ' + infosMachine.totalMemory + '\nFree : ' + infosMachine.freeMemory">
      <span class="badge">{{ infosMachine.useMemoryPercentage }} %</span>
    </div>
    <!-- HDD -->
    <div class="infoMachineItem" data-toggle="tooltip" data-placement="bottom" data-original-title="Data HDD usage">
      <span class="glyphicon glyphicon-hdd" aria-hidden="true"></span>
    </div>
    <div class="infoMachineItem" data-toggle="tooltip" data-placement="bottom" v-bind:class="{ 'badge-warning': infosMachine.diskApp && infosMachine.diskApp.fsIsAlmostFilled }" :data-original-title="'HDD\nTotal : ' + (infosMachine.diskApp && infosMachine.diskApp.totalDisk) + '\nFree : ' + (infosMachine.diskApp && infosMachine.diskApp.freeDisk)">
      <span class="badge">{{ infosMachine.diskApp && infosMachine.diskApp.useDiskPercentage }} %</span>
    </div>

    <div class="infoMachineItem" data-toggle="tooltip" data-placement="bottom" data-original-title="Docker HDD usage">
      <span class="glyphicon glyphicon-hdd" aria-hidden="true"></span>
    </div>
    <div class="infoMachineItem" data-toggle="tooltip" data-placement="bottom" v-bind:class="{ 'badge-warning':  infosMachine.diskDocker && infosMachine.diskDocker.fsIsAlmostFilled }" :data-original-title="'HDD\nTotal : ' + (infosMachine.diskDocker && infosMachine.diskDocker.totalDisk) + '\nFree : ' + (infosMachine.diskDocker && infosMachine.diskDocker.freeDisk)">
      <span class="badge">{{ infosMachine.diskDocker && infosMachine.diskDocker.useDiskPercentage }} %</span>
    </div>
  </div>


</template>


<script>
  import Store from './store.js';
  export default {

    mounted () {
      const self = this;

      // this.$nextTick(function () {
      // });

      // enables the bootstrap component for tooltips
      $('.infoMachineGroup [data-toggle="tooltip"]').tooltip();

      // Listen incoming messages typed as 'refreshInfosMachine' from the server.
      // Here the message comes from eventRefreshInfosMachine.js.
      self.Store.socket.on('refreshInfosMachine', function (infosMachineSocket) {
        // Update variable 'infosMachine'.
        // This will automatically refresh the infosMachineTable component.
        self.infosMachine = infosMachineSocket;

        // Put this bool to true in order to avoid console error on infosMachine component launch.
        // This bool is used on the HTML code just above.
        self.boolInfosFeed = true;
      });
    },

    data () {
      return {
        Store,
        infosMachine: {
          loadAverage: [0, 0, 0]
        },
        boolInfosFeed: false
      };
    }

  };

</script>



<style>

  .infoMachineGroup {
    padding-right: 10px;
  }

  .infoMachineGroup .infoMachineItem {
    margin: 0px;
    border: 0px;
    padding-right: 5px;
    padding-left: 5px;
    vertical-align: middle;
    vertical-align: middle;
    white-space: nowrap;
    min-width: 30px;
    display:inline;
  }

  .infoMachineGroup .badge-warning .badge {
    background-color: #d15b47!important;
    color: #fff!important;
  }

</style>
