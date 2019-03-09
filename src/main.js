// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Uimini from 'uimini/dist/css/uimini.css'
import Animation from 'uimini/src/stylus/base/animation.styl'

import App from './App'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'firebase/storage'

Vue.use(
  Vuelidate,
  Uimini,
  Animation
)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    // Initialize Firebase
    var config = {
      apiKey: 'AIzaSyDeNA-QymVyNpYdNXsc0CQWY3nNNzWj8JQ',
      authDomain: 'nimble-park-226417.firebaseapp.com',
      databaseURL: 'https://nimble-park-226417.firebaseio.com',
      projectId: 'nimble-park-226417',
      storageBucket: 'nimble-park-226417.appspot.com',
      messagingSenderId: '928531941568'
    }
    firebase.initializeApp(config)

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('loggedUser', user)
        this.$store.dispatch('loadTasks')
        this.$store.dispatch('loadTags')
        console.log(this.$store.getters.message.title)
      }
    })
  }
})
