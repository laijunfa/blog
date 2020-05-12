import axios from '@/utils/http'
//添加用户
export function addUserApi(obj) {
    let { username, email, phone, role_id,status, remark } = obj;
    return axios({
        method: 'post',
        url: '/addUser',
        data: {
            username,
            email,
            phone,
            role_id,
            status,
            remark
        }
    })
}

//删除用户
export function delUserApi(id) {
    return axios({
        url: '/delUser',
        params: {
            id
        }
    })
}
//编辑用户
export function editUserApi(obj) {
    let { nickname,avatar,id } = obj;
    return axios({
        method: 'post',
        url: '/updateUser',
        data: {
            nickname,avatar,id 
        }
    })
}
//状态设置
export function changeStatusApi(obj) {
    return axios({
        method: 'post',
        url: '/changeUserStatus',
        data: obj
    })
}
//获取用户集合
export function getUserDataApi(obj) {
    let { username, role_id, page, pageSize } = obj;
    return axios({
        method: 'get',
        url: '/queryUser',
        params: {
            username,
            role_id,
            page,
            pageSize
        }
    })
}
//获取用户个人信息
export function userInfoApi(obj) {
    let {id} = obj;
    return axios({
        method: 'get',
        url: '/userInfo',
        params: {
           id
        }
    })
}

//验证用户注册
export function checkRegisterApi(account){
    return axios({
        method:'get',
        url:'/checkRegister',
        params:{
            account
        }
    })
}
//验证用户注册
export function registerApi(obj){
    return axios({
        method:'post',
        url:'/register',
        data:obj
    })
}
//用户登录
export function loginApi(obj){
    return axios({
        method:'post',
        url:`/login`,
        data:obj
    })
}
