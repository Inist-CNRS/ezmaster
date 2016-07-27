
<!--
  This is a .vue component divided into 3 parts :
  - <template> containing the HTML code of this component.
  - <script> containing the javascript code of this component.
  - <style> containing the CSS code of this component.
 -->

<template>

  <!-- The navbar part displaying machine information. -->
  <ul class="nav nav-tabs navbar-nav navbar-right">

    <li class="infosMachine">

      <table id="infosMachineTable" class="table table-condensed">

        <thead>
          <tr>
            <th>
              <a href="#" class="infosMachine" data-toggle="tooltip" data-placement="bottom" title="Load Averages\n[[ infosMachine.nbCPUs ]] CPUs"><span class="glyphicon glyphicon-tasks"></span></a>
            </th>
            <th>
              <a href="#" class="infosMachine" data-toggle="tooltip" data-placement="bottom" title="RAM Use"><span class="glyphicon glyphicon-oil"></span></a>
            </th>
            <th>
              <a href="#" class="infosMachine" data-toggle="tooltip" data-placement="bottom" title="HDD Use"><span class="glyphicon glyphicon-hdd"></span></a>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <div class="btn-group btn-group-xs" role="group" aria-label="..." v-if="[[ boolInfosFeed ]] == 'true'">
                <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="Load Average over 1 minute">
                  <span class="infosMachine">[[ (infosMachine.loadAverage)[0] ]]</span>
                </button>
                <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="Load Average over 5 minutes">
                  <span class="infosMachine">[[ (infosMachine.loadAverage)[1] ]]</span>
                </button>
                <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="Load Average over 15 minutes">
                  <span class="infosMachine">[[ (infosMachine.loadAverage)[2] ]]</span>
                </button>
              </div>
            </td>
            <td>
              <div class="btn-group btn-group-xs" role="group" aria-label="...">
                <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="RAM\nTotal : [[ infosMachine.totalMemory ]]\n Free : [[ infosMachine.freeMemory ]]">
                  <span class="infosMachine">[[ infosMachine.useMemoryPercentage ]] %</span>
                </button>
              </div>
            </td>
            <td>
              <div class="btn-group btn-group-xs" role="group" aria-label="...">
                <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="HDD\nTotal : [[ infosMachine.totalDisk ]]\nFree : [[ infosMachine.freeDisk ]]">
                  <span class="infosMachine">[[ infosMachine.useDiskPercentage ]] %</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>

      </table>

    </li>

  </ul>

</template>



<script>

  /*global Vue, global io*/

  // Socket connection.
  var socket = io();


  //module.exports = {
  export default {

    ready () {

      let self = this;

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

  #infosMachineTable {
      width: 95%;
      margin: auto;
      margin-bottom: 2%;
      margin-top: 2%;
  }

  #infosMachineTable th, #infosMachineTable td {
      text-align: center;
  }

  .infosMachine {
      color:white;
      text-decoration:none;
  }

  .infosMachine:hover, .infosMachine:visited, .infosMachine:active {
      color:white;
      text-decoration:none;
  }

  .infosMachine {
      width:                  300px;
      font-size:              10px;
      background-color:       #0277BD;
  }

</style>