import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import moment from "moment";
import VueApexCharts from "vue-apexcharts";
import VueNativeSock from "vue-native-websocket";
import conf from "../config";
import vueHeadful from 'vue-headful';

Vue.component('vue-headful', vueHeadful);

Vue.use(VueNativeSock, conf.WebSocketServer, {
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000)
});

Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);
moment.locale('uk')
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  VueApexCharts,
  render: h => h(App)
}).$mount("#app");
