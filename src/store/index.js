import Vue from 'vue'
import Vuex from 'vuex'
import local from '../utils/localStorage'
Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    //打开页面时,从本地获取token,如果有就取出来,没有则设置空对象
    userInfo:local.get('userInfo') || {}
  },
  mutations:{
    setUserInfo(state,obj){
      state.userInfo=obj;
      if(obj.u_role!==0){
        //不是管理员不把role存在local
        delete obj.u_role 
      }
      //存储在本地
      local.set('userInfo',obj);
    }
  }
})
