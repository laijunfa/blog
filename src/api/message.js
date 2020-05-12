import axios from '@/utils/http'
//新增留言
export function addMessageApi(obj) {
    return axios({
        method: 'post',
        url: '/addMessage',
        data: obj
    })
}

//删除留言
export function delMessageApi(id) {
    return axios({
        url: '/delMessage',
        params: {
            id
        }
    })
}
//修改留言(通过)
export function changeMsgStatusApi(id) {
    //用户id,内容
    return axios({
        method: 'post',
        url: '/changeMsgStatus',
        data: {id}
    })
}
// 获取所有留言
export function getMessageListApi(obj) {
    return axios({
        method: 'get',
        url: '/queryMessage',
        params:obj
    })
}