
<style>

    red {
        color: red;
    }

</style>



<template>

  <div class="red">

    <h1>{{ message }}</h1>
    <h1>Hello !</h1>

  </div>

</template>



<script>



module.exports = {

    data : function() {

        return {
            message : 'Hello from Factice.vue !'
        }

    }

}


export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      message: 'Hello World!'
    }
  }
}


</script>

