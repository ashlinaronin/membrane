import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/synth-test",
      name: "synth-test",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "synth-test" */ "./views/SynthTest.vue")
    },
    {
      path: "/composite-test",
      name: "composite-test",
      component: () =>
        import(/* webpackChunkName: "composite-test" */ "./views/CompositeTest.vue")
    },
    {
      path: "/recordings",
      name: "recordings",
      component: () =>
        import(/* webpackChunkName: "recordings" */ "./views/Recordings.vue")
    },
    {
      path: "/:performer",
      name: "performer",
      component: Home
    }
  ]
});
