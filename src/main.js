import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';

import 'jquery/src/jquery.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// Plugins import
import Vuelidate from 'vuelidate'


import routes from './routes';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  history: true,
  mode: 'history',
  routes,
  linkExactActiveClass: "nav-item active"
});

Vue.router = router
Vue.use(VueRouter)

// Plugins setup
Vue.use(Vuelidate);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
