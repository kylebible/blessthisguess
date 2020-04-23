import App from "@/App.vue";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      name: "App",
      component: App,
    },
    { path: "/:roomName", name: "rooms", component: App },
  ],
});
