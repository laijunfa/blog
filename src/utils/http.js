import axios from 'axios'
// import store from '@/store/index.js'
import {Message} from 'element-ui'
import router from '../router/index'
import local from '@/utils/localStorage'
//创建一个axios实例
let instance = axios.create({
    //配置基地址
    // baseURL: "http://localhost:6060/api",
    baseURL: "http://106.14.155.113:6060/api",
});

//请求拦截器
instance.interceptors.request.use(function (config) {
    let userInfo=local.get('userInfo');
    // token存在设置请求头
    if (userInfo) {
        config.headers = { 'token': userInfo.token }
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(function (response) {
    if(response.data.code==403){
        router.push('/login');
        Message.error(response.data.msg);
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default instance