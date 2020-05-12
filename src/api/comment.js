import axios from '@/utils/http'
//新增评论
export function addCommentApi(obj) {
    return axios({
        method: 'post',
        url: '/addComment',
        data: obj
    })
}
//新增留言回复
export function addComReplyApi(obj) {
    return axios({
        method: 'post',
        url: '/addComReply',
        data: obj
    })
}
//删除评论
export function delCommnetApi(id) {
    return axios({
        url: '/delComment',
        params: {
            id
        }
    })
}
//修改评论(通过)
export function changeComStatusApi(obj) {
    return axios({
        method: 'post',
        url: '/changeComStatus',
        data: obj
    })
}

//获取当前文章的所有评论
export function getCommentsApi(obj) {
    return axios({
        method: 'get',
        url: '/getCommentsByArticleId',
        params:obj
    })
}
