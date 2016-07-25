
/*module.exports = */new Vue({
  el: 'body',
  components: {
    // The left key corresponds to the html tag where the component is included.
    // For exemple, we put the table.vue component into <instancestable></instancestable> in template.html.
    infosmachine : require('./infosMachineTable.vue'),
    instancestable : require('./table.vue'),
    addinstance : require('./addInstance.vue')
  }
}).mount();