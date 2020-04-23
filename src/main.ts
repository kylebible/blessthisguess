import store from "@/store";
import router from "@/router";
import VueCompositionApi from "@vue/composition-api";
import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";

Vue.config.productionTip = false;

Vue.use(VueCompositionApi);
Vue.use(Buefy);

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
