const express = require('express')
const async = require('async')
const connection = require('./db.js')
// 1. 创建一个路由容器
const router = express.Router()

/**
 * 试题 (增删改查)
 */
// 新增
router.post('/api/addQuestion', (request, response) => {
  // console.log('试题',request.body.multiple_select_answer);
  
  let { title, answer, answer_analyze, subject, type, level,options,multiple_select_answer } = request.body;
  if(type=="多选"){
    answer=multiple_select_answer
  }
  connection.query(`insert into question(title,answer,answer_analyze,subject,type,level) values 
    ('${title}','${answer}','${answer_analyze}',${subject},'${type}','${level}');`, (error, result) => {
    if (error == null) {
      let question_id=result.insertId;//新增试题返回来的主键id
      let newOptions=[]
      //遍历options选项,格式改为[question_id,label,text] 批量插入数据库
      for (let i = 0; i < options.length; i++) {
        if(options[i].text){
          newOptions.push([question_id,options[i].label,options[i].text])
        }
      }
      //试题选项
      let sql=`insert into question_options(question_id,label,text) values ?`;
      connection.query(sql,[newOptions],(error,result)=>{
        if(error==null){
          response.send({
            code: 200,
            msg: '新增成功'
          });
        }else{
          console.log(error);
        }
      })
      
    } else {
      response.send({
        code: 500,
        msg: '新增失败'
      })
    }
  })
})
//2.删除试题(逻辑删除)
router.get('/api/delQuestion', (request, response) => {
  let { id } = request.query;
  connection.query(`update question set isDelete=1 where id=${id}`, (error, result) => {
    if (error == null) {
      response.send({
        code: 200,
        data: result
      });
    } else {
      response.send({
        code: 500,
        msg: '服务器错误'
      })
    }
  })
})
//3.修改状态
router.post('/api/updateQuestion', (request, response) => {
  let { id } = request.body;
  connection.query(`update question set status=1  where id=${id}`, (error, result) => {
    if (error == null) {
      response.send({
        code: 200,
        msg: '更新成功'
      })
    } else {
      response.send({
        code: 500,
        msg: '服务器错误'
      })
    }
  })
})
//4.1 获取试题
router.get('/api/queryQuestion', async (request, response) => {
  let {count,subjectId} =request.query;
  console.log(request.query);
  connection.query(`select * from question  where subject=${subjectId} and status=1 and isDelete=0 limit 0,${count}`, (error, result) => {
    if (error == null) {
      result.forEach((item,index) => {
        //根据试题id获取答案选项
        connection.query(`select * from question_options where question_id=${item.id}`, (error2, result2) => {
          //获取到的选项添加到当前试题
          item.options = result2;
          //执行完后返回
          if (result.length-1==index) {
            response.send({
              code: 200,
              data: result,
            })
          }
        })
      })
    } else {
      response.send({
        code: 500,
        msg: '服务器错误'
      })
    }
  })
})
//试题分组
router.get('/api/questionGroup', (request, response) => {
  connection.query(`select count(*) as count,s.name,s.id from question q,subject s where q.subject=s.id GROUP BY q.subject`, (error, result) => {
    if (error == null) {
      response.send({
        code: 200,
        data:result
      })
    } else {
      response.send({
        code: 500,
        msg: '服务器错误'
      })
    }
  })
})


module.exports = router