const express = require('express')
const jwt=require('jsonwebtoken')
const connection =require('../server/db.js')
const multer = require('multer');//处理用户头像文件上传
const path=require('path')
//上传的头像保存在 avatar
const storage = multer.diskStorage({
    //存储的位置
    destination(req, file, cb){
        cb(null, 'server/upload/images/avatar')
    },
    //文件名字的确定 multer默认帮我们取一个没有扩展名的文件名，因此需要我们自己定义
    filename(req, file, cb){
        cb(null,Date.now()+file.originalname) //时间戳加文件名
    }
})
 //传入storage 除了这个参数我们还可以传入dest等参数
const upload = multer({storage})
// const uploadAvatar = multer2({storageAvatar})
// 1. 创建一个路由容器
const router = express.Router()
/**
 * 用户 (增删改查)
 */
// 新增
router.post('/api/addUser',(request,response)=>{
    let {u_nickname,u_password,u_avatar}=request.body;
    let sql=`insert into user(u_nickname,u_password,u_avatar) values ('${u_nickname}','${u_password}','${u_avatar}')`
    connection.query(sql,(error,result)=>{
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
})
//2.删除用户(逻辑删除)
router.get('/api/delUser',(request,response)=>{
    let {id}=request.query;
    connection.query(`update user set isDelete=1 where u_id=${id}`,(error,result)=>{
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
// 3.1 修改用户个人信息
router.post('/api/updateUser',(request,response)=>{
    let {nickname,avatar,id}=request.body;
    connection.query(`update user set u_nickname='${nickname}',u_avatar='${avatar}' where u_id=${id}`,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                msg:'更新成功'
            })
            //4.2根据用户账号获取详情
        }else{
            response.send({
                code:500,
                msg:'服务器错误'
            })
        }
    })
})
//3.2修改用户状态
router.post('/api/changeUserStatus',(request,response)=>{
    let {id,status}=request.body;
    if(status==0){
        status=1
    }else{
        status=0
    }
    connection.query(`update user set status=${status} where u_id=${id}`,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                msg:'修改成功'
            })
        }else{
            response.send({
                code:500,
                msg:'服务器错误'
            })
        }
    })
})

//4.1获取用户信息(分页)
router.get('/api/queryUser',(request,response)=>{
    let {page,pageSize,username,role_id}=request.query;
    //分页查询
    let sql=`SELECT * FROM user where isDelete=0`
    if(username){
        sql+=` and u_nickname like '%${username}%' `
    }   
    if(role_id){
        sql+=` and u_role=${role_id} `
    }   
    sql+=` limit ${(page-1)*pageSize},${pageSize}`
    connection.query(sql,(error,result)=>{
        if(error==null){
            //获取用户总数
            connection.query(`select count(0) as total from user where isDelete=0 and u_role=1`,(error,result2)=>{
                response.send({
                    code:200,
                    total:result2[0].total,
                    data:result
                });
            })
        }else{
            response.send({
                msg:'服务器错误',
                code:500
            });
        }
    })
})
router.get('/api/userInfo',(request,response)=>{
    let {id}=request.query;
    connection.query(`SELECT * FROM user where u_id=${id}`,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                data:result[0]
            });
        }else{
            response.send({
                msg:'服务器错误',
                code:500
            });
        }
    })
})
//验证用户名是否注册
router.get('/api/checkRegister',(request,response)=>{
    let {account}=request.query;
    let sql=`select count(*) as count from user where u_account='${account}'`;
    console.log(sql);
    
    connection.query(sql,(error,result)=>{
        if(error==null){
            console.log(result[0].count);
            if(result[0].count>0){
                response.send({
                    code:201,
                    msg:'账号已被注册'
                })
            }else{
                response.send({
                    code:200,
                    msg:'账号可以使用'
                })
            }
        }else{
            // console.log(error);
        }
    })
})

//注册
router.post('/api/register',(request,response)=>{
    let {ip,account,password,nickname,imageUrl}=request.body;
    let sql=`insert into user(u_ip,u_account,u_password,u_nickname,u_avatar) 
    value(?,?,?,?,?)`;
    let params=[ip,account,password,nickname,imageUrl];
    connection.query(sql,params,(error,result)=>{
        console.log(result);
        if(error==null){
            let obj={
                u_id:result.insertId,//新增用户返回来的主键id
                username:nickname
            }
            //自定义的密钥
            let secret="laijunfa";
            // jwt.sign() 接受两个参数，一个是传入的对象，一个是自定义的密钥
            let token = jwt.sign(obj, secret, {
                expiresIn: 60*60*24  // 过期时间(24小时过期)
            });
            let user={
                u_id:result.insertId,
                u_nickname:nickname,
                u_avatar:imageUrl,
                u_role:1
            }
            
            response.send({
                token,
                code:200,
                data:user,
                msg:'注册成功'
            })
        }else{
            // console.log(error);
        }
    })
})
//登录
router.post('/api/login',(request,response)=>{
    let {account,password}=request.body;
    let sql=`select u_id,u_nickname,u_avatar,u_role from user where u_account='${account}' and u_password='${password}'`;
    connection.query(sql,(error,result)=>{
        if(error==null){
            if(result.length>0){
                let obj={
                    u_id:result[0].u_id,
                    username:result[0].u_nickname
                }
                //自定义的密钥
                let secret="laijunfa";
                // jwt.sign() 接受两个参数，一个是传入的对象，一个是自定义的密钥
                let token = jwt.sign(obj, secret, {
                    expiresIn: 60*60*24  // 过期时间(1小时过期)
                });
                response.send({
                    token,
                    code:200,
                    data:result,
                    msg:'登录成功'
                })
            }else{
                response.send({
                    code:201,
                    msg:'用户名或密码错误'
                })
            }
        }else{
            // console.log(error);
        }
    })
    
})
//验证token
router.post('/api/checkout',(request,response)=>{
    //获取请求头的授权信息
    let token=request.headers.authorization;
    //密钥
    let SECRET='laijunfa';
    // 验证token
    jwt.verify(token, SECRET,(error,decoded)=>{
        try {
            if (error) {         
                //token失效或者token是伪造的
                response.send({
                    code:401,
                    msg:'token过期了'
                });            
            } else {
                //token存在
                console.log('token存在',decoded);
            }
        } catch (error) {
            console.log('报错啦');
        }
    });
    
})
//上传用户头像
router.post('/api/upload/avatar',upload.single('image'),(request,response)=>{
    let url=path.join(request.headers.host,'/images/avatar/',request.file.filename);
    console.log(request.file);
    url=url.replace("\\", "\/");
    url=url.replace("\\", "\/");
    url=url.replace("\\", "\/");
    response.send({
        code:200,
        imgUrl:url
    })
})
module.exports = router