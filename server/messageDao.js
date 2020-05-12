const express = require('express')
const jwt=require('jsonwebtoken')
const connection =require('./db.js')
// 1. 创建一个路由容器
const router = express.Router()
/**
 * 留言 (增删改查)
 */
// 新增
router.post('/api/addMessage',(request,response)=>{
    let {u_id,content,visitor,status,userUrl}=request.body;
    //获取请求头的授权信息
    let token=request.headers.token;
    let flag=false;//false为访客
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
        //新增留言
        let sql=`insert into message(u_id,content,status,visitor,url) values (?,?,?,?,?);`
        let params=[u_id,content,status,visitor,userUrl]
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

//2.删除留言(逻辑删除)
router.get('/api/delMessage',(request,response)=>{
    let {id}=request.query;
    connection.query(`update message set isDelete=1 where id=${id}`,(error,result)=>{
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
//3.修改数据
// 3.1 修改留言(通过)
router.post('/api/changeMsgStatus',(request,response)=>{
    let id=request.body.id;
    console.log(id);
    
    connection.query(`update message set status=1  where id=${id}`,(error,result)=>{
        console.log(error);
        
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


//4.1 查询所有留言
router.get('/api/queryMessage',(request,response)=>{
    let {page,pageSize,username,status}=request.query;
    let sql=`select m.*,u.u_nickname,u.u_avatar from user u right outer join message m  on m.u_id=u.u_id where m.isDelete=0` ;
    
    if(username){
        sql+=` and u_nickname like '%${username}%' `
    }
    if(status){
        sql+=` and m.status=${status} `
    }
    sql+=` ORDER BY time desc limit ${(page-1)*pageSize},${pageSize} `;
    connection.query(sql,(error,result)=>{
        if(error==null){
            // 遍历所有留言的回复
            for (let i = 0; i < result.length; i++) {
                // -- 先使用user右外连接reply表,保证所有数据查询到,再连接评论表
                let sql3=`select r.*,u.u_nickname,u.u_avatar from user u right outer join comment_reply r on u.u_id=r.u_id
                inner join message m on r.comment_id=m.id  where r.type=1 and r.comment_id=${result[i].id}`
                connection.query(sql3,(error3,result3)=>{//1,2
                    result[i].replys=[]
                    if(result3.length>0){
                        //有回复 添加到数组
                        result[i].replys.push(...result3);
                    }
                })
            }
            //留言总数
            let sql2=`select count(0) total from message where isDelete=0`;
            if(status){
                sql2+=` and status=${status} `
            }
            connection.query(sql2,(error2,result2)=>{
                response.send({
                    code:200,
                    total:result2[0].total,
                    data:result
                });
            });
            //释放 connection.release();
        }else{
            response.send({
                msg:'服务器错误',
                code:500
            });
        }
    })
})
module.exports = router