<template>
    <div id="content">

      <nav class="navbar navbar-light" style="background-color: #0277BD;">

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

          <div id="navbar" class="navbar-collapse collapse">
            <!-- Tabs in the header bar to select Instances or Applications -->
            <ul class="nav navbar-nav">
              <li class="nav-item active"><a data-toggle="tab" class="nav-link" href="#instancestable">Instances</a></li>
              <li class="nav-item"><a data-toggle="tab" class="nav-link" href="#apps">Applications</a></li>
            </ul>

            <!-- LoadAverage / RAM / HDD -->
            <infosmachine></infosmachine>
          </div>


        </div>
      </nav>



      <div class="tab-content">


        <div id="instancestable" class="tab-pane fade in active">

          <instancestable></instancestable>
          <addinstance ></addinstance>

        </div>

        <div id="apps" class="tab-pane fade">

          <apps></apps>
          <addapps></addapps>

        </div>

      </div>

      <div class="ezfooter">
        <a href="https://github.com/Inist-CNRS/ezmaster">ezMaster</a> version 3.0.1
      </div>

    </div>
</template>

<script>
import vueInfosMachineTable from './infos-machine-table.vue';
import vueTable             from './table.vue';
import vueAddInstance       from './add-instance.vue';
import vueaddApps           from './add-apps.vue';
import vueApps              from './apps.vue';


export default {
	components: {
	    infosmachine : vueInfosMachineTable,
		instancestable : vueTable,
		addinstance : vueAddInstance,
		apps : vueApps,
		addapps : vueaddApps
	}
}
</script>

<style>
</style>
