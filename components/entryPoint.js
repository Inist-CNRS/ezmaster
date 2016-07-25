
/*module.exports = */new Vue({
  el: 'body',
  components: {
    // App correspond à la balise <app> dans le html.
    // On met donc le composant Factice au sein de la balise <app></app>.
    App : require('./Factice.vue'),
    infosmachine : require('./infosMachineTable.vue')
  }
}).mount();