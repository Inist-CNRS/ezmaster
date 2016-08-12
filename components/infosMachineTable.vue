
<!--
  This is a .vue component divided into 3 parts :
  - <template> containing the HTML code of this component.
  - <script> containing the javascript code of this component.
  - <style> containing the CSS code of this component.
 -->

<template>

  <!-- The navbar part displaying machine information. -->

  <div class="navbar-text navbar-right infoMachineGroup">

    <!-- LoadAverage -->  
    <div class="glyphicon1 glyphicon glyphicon-tasks" data-toggle="tooltip" data-placement="bottom" data-original-title="Load average\n[[ infosMachine.nbCPUs ]] CPUs"></div>
    <span class="badge1-1 badge" data-toggle="tooltip" data-placement="bottom" data-original-title="Load average over 1 minutes">[[ (infosMachine.loadAverage)[0] ]]</span>
    <span class="badge1-2 badge" data-toggle="tooltip" data-placement="bottom" data-original-title="Load average over 5 minutes">[[ (infosMachine.loadAverage)[1] ]]</span>
    <span class="badge1-3 badge" data-toggle="tooltip" data-placement="bottom" data-original-title="Load average over 15 minutes">[[ (infosMachine.loadAverage)[2] ]]</span>

    <!-- RAM -->
    <div class="glyphicon2 glyphicon glyphicon-oil" data-toggle="tooltip" data-placement="bottom" data-original-title="RAM usage"></div>
    <span class="badge2-1 badge" data-toggle="tooltip" data-placement="bottom" data-original-title="RAM\nTotal : [[ infosMachine.totalMemory ]]\nFree : [[ infosMachine.freeMemory ]]">[[ infosMachine.useMemoryPercentage ]] %</span>

    <!-- HDD -->
    <div class="glyphicon3 glyphicon glyphicon-hdd" data-toggle="tooltip" data-placement="bottom" data-original-title="HDD usage"></div>
    <span class="badge3-1 badge" data-toggle="tooltip" data-placement="bottom" data-original-title="HDD\nTotal : [[ infosMachine.totalDisk ]]\nFree : [[ infosMachine.freeDisk ]]">[[ infosMachine.useDiskPercentage ]] %</span>

  </div>


</template>


<script>

  /*global Vue, global io*/

  // Socket connection.
  var socket = io();


  export default {

    ready () {

      let self = this;

      // enables the bootstrap component for tooltips
      $('.infoMachineGroup [data-toggle="tooltip"]').tooltip();

      // Listen incoming messages typed as 'refreshInfosMachine' from the server.
      // Here the message comes from eventRefreshInfosMachine.js.
      socket.on('refreshInfosMachine', function(infosMachineSocket) {

        // Update variable 'infosMachine'.
        // This will automatically refresh the infosMachineTable component.
        self.$set('infosMachine', infosMachineSocket);

        // Put this bool to true in order to avoid console error on infosMachine component launch.
        // This bool is used on the HTML code just above.
        self.$set('boolInfosFeed', true);

      });

    },


    data () {

      return {
        infosMachine: {},
        boolInfosFeed: false
      }

    }

  }

</script>



<style>

  .navbar .navbar-text.infoMachineGroup {
    margin-top: 18px;
    margin-bottom: 0;
  }

  .infoMachineGroup .glyphicon2,
  .infoMachineGroup .glyphicon3 {
    margin-left: 20px;
  }
  .infoMachineGroup .glyphicon1,
  .infoMachineGroup .glyphicon2,
  .infoMachineGroup .glyphicon3 {
    margin-right: 3px;
  }

  .infoMachineGroup .badge3-1 {
    margin-right: 10px;
  }

  .infoMachineGroup .badge {
    background-color: #015b90;
  }

</style>