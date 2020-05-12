const express = require('express')

const connection =require('./db.js')
// 1. 创建一个路由容器
const router = express.Router()
const jwt=require('jsonwebtoken')
/**
 * 评论 (增删改查)
 */
// 新增
router.post('/api/addComment',(request,response)=>{
    let {u_id,articleId,content,visitor} =request.body;
    //获取请求头的授权信息
    let token=request.headers.token;
    let flag=false;
    if(token!='undefined'){
        //密钥
        let SECRET='laijunfa';
        // 解密 token 获取对应的 id
        jwt.verify(token, SECRET,(error,decoded)=>{
            if (error) { 
                //token失效或者token是伪造的
                response.send({
                    code:403,
                    msg:'登录已过期,请重新登录'
                });       
            }else{
                // 验证用户是否修改了id
                if(u_id!==decoded.u_id){
                   flag=true;
                }
            }
        });
    }
    if(flag){
        response.send({
            code:401,
            msg:'用户ID错误,添加失败'
        })
    }else{
        // 新增评论
        let sql=`insert into comment(u_id,articleId,content,visitor) values (?,?,?,?)`;
        let params=[u_id,articleId,content,visitor]
        connection.query(sql,params,(error,result)=>{
            if(error==null){
                response.send({
                    code:200,
                    msg:'新增成功'
                });
            }else{
                response.send({
                    code:500,
                    msg:'新增失败'
                })
            }
        })
    }
})
//2.新增评论回复
router.post('/api/addComReply',(request,response)=>{
    let {comment_id,type,u_id,reply_name,content}=request.body;
    let sql=`insert into comment_reply(comment_id,type,u_id,reply_name,content)
     value(?,?,?,?,?)`;
    let params=[comment_id,type,u_id,reply_name,content];
    connection.query(sql,params,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                msg:'新增回复成功'
            });
        }else{
            response.send({
                code:500,
                msg:'服务器错误'
            })
        }
    })
})

//2.删除评论(逻辑删除)
router.get('/api/delComment',(request,response)=>{
    let {id}=request.query;
    connection.query(`update comment set isDelete=1 where id=${id}`,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                data:result
            });
        }else{
            response.send({
                code:500,
                msg:'服务器错误'
            })
        }
    })
})
//3.修改状态
router.post('/api/changeComStatus',(request,response)=>{
    let {id}=request.body;
    connection.query(`update comment set status=1  where id=${id}`,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                msg:'更新成功'
            })
        }else{
            response.send({
                code:500,
                msg:'服务器错误'
            })
        }
    })
})



module.exports = router