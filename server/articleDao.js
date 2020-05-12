const express = require('express')
const path=require('path')
const multer = require('multer');//处理文件上传
// const upload = multer({ dest: "upload/" });//帮你创建一个文件
const connection =require('../server/db.js')

//上传的文件保存在 upload
const storage = multer.diskStorage({
    //存储的位置
    destination(req, file, cb){
        cb(null, 'server/upload/images/article')
    },
    //文件名字的确定 multer默认帮我们取一个没有扩展名的文件名，因此需要我们自己定义
    filename(req, file, cb){
        cb(null,Date.now()+file.originalname)
    }
})
 //传入storage 除了这个参数我们还可以传入dest等参数
const upload = multer({storage})
// 1. 创建一个路由容器
const router = express.Router()

/**
 * 文章 (增删改查)
 */
// 新增
router.post('/api/addArticle',(request,response)=>{
    let {u_id,title,content,sort_id,isInterview,imgUrl,html}=request.body;
    
    if(isInterview==undefined){
        isInterview=0
    }
    let sql=`insert into article(u_id,title,content,html,sort_id,isInterview,imgUrl) values (${u_id},'${title}','${content}','${html}',${sort_id},${isInterview},'${imgUrl}');`
    connection.query(sql,(error,result)=>{
        console.log(error);
        
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
//2.删除文章(逻辑删除)
router.get('/api/delArticle',(request,response)=>{
    let {id}=request.query;
    connection.query(`update article set isDelete=1 where id=${id}`,(error,result)=>{
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
// 3.1 编辑文章
router.post('/api/updateArticle',(request,response)=>{
    let {id,title,content,sort_id,html,imgUrl}=request.body;
    
    let sql=`update article set content='${content}',title='${title}',html='${html}',sort_id=${sort_id},imgUrl='${imgUrl}' where id=${id}`
    connection.query(sql,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                msg:'编辑成功'
            })
        }else{
            response.send({
                code:500,
                msg:'服务器错误'
            })
        }
    })
})
// 3.2根据文章id修改阅读量
router.get('/api/updateReadCount',(request,response)=>{
    let {articleId}=request.query;
    connection.query(`update article set views=views+1  where id=${articleId}`,(error,result)=>{
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
// 3.3修改点赞数
router.get('/api/updateLike',(request,response)=>{
    let {articleId}=request.query;
    connection.query(`update article set like_count=like_count+1  where id=${articleId}`,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                msg:'更新点赞数成功'
            })
        }else{
            response.send({
                code:500,
                msg:'服务器错误'
            })
        }
    })
})
// 3.1 文章状态
router.post('/api/changeArtStatus',(request,response)=>{
    let {id,status}=request.body;
    connection.query(`update article set status=${status}  where id=${id}`,(error,result)=>{
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
//4.1 查询所有文章 分页
router.get('/api/queryArticle',(request,response)=>{
    let {page,pageSize,title,sort_id,status}=request.query;
    let sql=`SELECT a.*,u.u_nickname,s.name as art_sort FROM article a,user u,article_sorts s where a.u_id=u.u_id and a.sort_id=s.id and a.isDelete=0 and a.isInterview=0`;
    if(title){
        sql+=` and title like '%${title}%' `
    }
    if(sort_id){
        sql+=` and sort_id='${sort_id}' `
    }
    if(status){
        sql+=` and status='${status}' `
    }
    sql+=` ORDER BY isTop desc,date desc limit ${(page-1)*pageSize},${pageSize} `;
    
    connection.query(sql,(error,result)=>{
        if(error==null){
            let sql2=`select count(0) total from article where isDelete=0 and isInterview=0`;
            if(sort_id){
                sql2+=` and sort_id=${sort_id} `
            }
            connection.query(sql2,(error2,result2)=>{
                if(error==null){
                    response.send({
                        code:200,
                        total:result2[0].total,
                        data:result
                    });
                }
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
//4.2根据文章id获取详情
router.get('/api/articleDetails',(request,response)=>{
    let {articleId}=request.query;
    connection.query(`SELECT a.*,u.u_nickname,s.name as art_sort FROM article a,user u,article_sorts s where a.u_id=u.u_id and a.sort_id=s.id and a.isDelete=0 and a.id=${articleId};`,(error,result)=>{
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

//4.3根据文章id获取评论(分页)
router.get('/api/getCommentsByArticleId',(request,response)=>{
    let {articleId,page,pageSize,status}=request.query;
    //分页查询
    let sql=`select c.*,u.u_nickname,u.u_avatar from user u right outer join comment c 
            on c.u_id=u.u_id where c.articleId=${articleId}`
    if(status){
        sql+=` and c.status=${status} `
    }
    sql+=` ORDER BY time desc limit ${(page-1)*pageSize},${pageSize} `;
    connection.query(sql,(error,result)=>{
        if(error==null){
             // 遍历所有评论的回复
             for (let i = 0; i < result.length; i++) {
                //  先使用user右外连接reply表,保证所有数据查询到,再连接评论表
                let sql3=`select r.*,u.u_nickname,u.u_avatar from user u right outer join comment_reply r on u.u_id=r.u_id 
                inner join comment c on r.comment_id=c.id  where r.type=0 and r.comment_id=${result[i].id}`
                connection.query(sql3,(error3,result3)=>{
                    result[i].replys=[]
                    if(result3.length>0){
                        //有回复 添加到数组
                        result[i].replys.push(...result3);
                    }
                })
            }
            let sql2=`select count(0) as total from comment where articleId=${articleId}`;
            if(status){
                sql2+=` and status=${status} `
            }
            //获取当前文章评论总数
            connection.query(sql2,(error,result2)=>{
                //将文章评论总数一起返回去
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
//获取文章分类
router.get('/api/queryArticleSort',(request,response)=>{
    connection.query(`select * from article_sorts`,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                data:result
            });
        }else{
            response.send({
                msg:'服务器错误',
                code:500
            });
        }
    })
})
//根据文章类型分组
router.get('/api/queryArticleGroup',(request,response)=>{
    connection.query(`select count(*) as count,s.name,s.id from article a,article_sorts s where a.sort_id=s.id and a.isDelete=0 and a.isInterview=0 GROUP BY a.sort_id`,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                data:result
            });
        }else{
            response.send({
                msg:'服务器错误',
                code:500
            });
        }
    })
})

//获取面试文章
router.get('/api/getInterviewArticle',(request,response)=>{
    let {sort_id}=request.query;
    connection.query(`select * from article where isDelete=0 and isInterview=1 and sort_id=${sort_id} `,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                data:result
            });
        }else{
            response.send({
                msg:'服务器错误',
                code:500
            });
        }
    })
})
//新增面试分类
router.post('/api/addArticleSort',(request,response)=>{
    let {name}=request.body;
    connection.query(`insert into article_sorts(name) value ('${name}')`,(error,result)=>{
        if(error==null){
            response.send({
                code:200,
                data:result
            });
        }else{
            response.send({
                msg:'服务器错误',
                code:500
            });
        }
    })
})
//上传文章图片
router.post('/api/upload/article',upload.single('image'),(request,response)=>{
    // 上传成功返回的文件名
    let url=path.join(request.headers.host,'/images/article/',request.file.filename);
    url=url.replace("\\", "\/");
    url=url.replace("\\", "\/");
    url=url.replace("\\", "\/");
    response.send({
        code:200,
        imgUrl:url
    })
})
module.exports = router