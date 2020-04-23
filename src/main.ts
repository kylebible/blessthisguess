import store from "@/store";
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
  render: (h) => h(App),
}).$mount("#app");
