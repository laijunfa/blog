import axios from '@/utils/http'
//新增文章
export function addArticleApi(article) {
    //用户id,标题,内容
    // console.log(article);
    return axios({
        method: 'post',
        url: '/addArticle',
        data: article
    })
}
//上传文章图片
export function uploadApi(fd) {
    return axios({
        method: 'post',
        url: '/upload/atricle',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: fd
    })
}
//删除文章
export function delArticleApi(id) {
    return axios({
        url: '/delArticle',
        params: {
            id
        }
    })
}
//修改文章
export function editArticleApi(obj) {
    //文章id,标题,内容
    let { id, title, content } = obj;
    return axios({
        method: 'post',
        url: '/updateArticle',
        data: obj
    })
}
//根据文章id修改阅读量
export function updateReadCountApi(articleId) {
    return axios({
        method: 'get',
        url: '/updateReadCount',
        params:{
            articleId
        }
    })
}
//修改点赞数
export function updateLikeApi(articleId) {
    return axios({
        method: 'get',
        url: '/updateLike',
        params:{
            articleId
        }
    })
}
//修改点赞数
export function changeArtStatusApi(obj) {
    return axios({
        method: 'post',
        url: '/changeArtStatus',
        data:obj
    })
}
// 获取文章
export function getArticleListApi(obj) {
    return axios({
        method: 'get',
        url: '/queryArticle',
        params:obj
    })
}

// 根据id查询文章详情
export function getArticleDetailsApi(articleId) {
    return axios({
        method: 'get',
        url: '/articleDetails',
        params:{
            articleId
        }
    })
}
// 获取文章分类
export function getArticleSortApi() {
    return axios({
        url: '/queryArticleSort',
    })
}
// 文章分组
export function getArticleGroupApi() {
    return axios({
        url: '/queryArticleGroup',
    })
}

// 新增分类
export function addArticleSortApi(name) {
    return axios({
        method: 'post',
        url: '/addArticleSort',
        data:{
            name
        }
    })
}
// 获取面试文章的分类
export function getInterviewTypeApi() {
    return axios({
        method: 'get',
        url: '/getInterviewSort',
    })
}
//根据类型获取面试文章
export function getInterviewArticleApi(sort_id) {
    return axios({
        method: 'get',
        url: '/getInterviewArticle',
        params:{
            sort_id
        }
    })
}

