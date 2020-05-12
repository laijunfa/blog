import axios from '@/utils/http'

//获取问题集合
export function queryQuestionApi(obj) {
    let { count, subjectId, pageSize } = obj;
    return axios({
        method: 'get',
        url: '/queryQuestion',
        params:{
            count,
            subjectId
        }
    })
}
//添加问题
export function addquestionApi(question) {
    // let { title, answer, answer_analyze, subject, type, level } = question;
    return axios({
        method: 'post',
        url: '/addQuestion',
        data: question
    })
}

//状态设置
export function changeStatusApi(id) {
    return axios({
        method: 'post',
        url: '/question/status',
        data: {
            id
        }
    })
}
//删除问题
export function delquestionApi(id) {
    return axios({
        method: 'post',
        url: '/question/remove',
        data: {
            id
        }
    })
}
//编辑问题
export function editquestionApi(obj) {
    let {question, answer,subject} = obj;
    return axios({
        method: 'post',
        url: '/question/edit',
        data: {
            question,
            answer,
            subject,
        }
    })
}

//获取试题类型及数量
export function questionCountApi() {
    return axios({
        method: 'get',
        url: '/questionGroup',
    })
}