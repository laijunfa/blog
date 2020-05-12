import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router/index.js'
// 导入element插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import moment from 'moment'
moment.locale('zh-cn')
//导入axios
import axios from 'axios'
Vue.config.productionTip = false

// 基地址设置
// axios.defaults.baseURL = "http://localhost:6060/api";
// // 将axios添加到vue原型上，让vue的实例拥有axios，vue实例可以通过this.$axios访问axios
Vue.prototype.$moment = moment


//注册插件
Vue.use(ElementUI);
new Vue({
  render: h => h(App),
  store,
  //挂载路由到实例
  router
}).$mount('#app')
