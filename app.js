//导包
const express = require('express');
const articleDao=require('./server/articleDao.js');//文章表的操作
const userDao=require('./server/userDao.js');//用户表的操作
const commentDao=require('./server/commentDao.js');//评论表的操作
const messageDao=require('./server/messageDao.js');//留言表的操作
const questionDao=require('./server/questionDao.js');//试题表的操作
const jwt=require('jsonwebtoken') //生成token
//创建服务器
const app = express();

// 使用cors中间件解决跨域问题
const cors = require('cors')
var bodyParser = require('body-parser');//解析post传入的参数
//使用中间件
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//静态资源托管
app.use(express.static('./server/upload'));

//验证token
// app.use(function (request, response, next) {
//     //把登陆和注册请求去掉了
//     if (request.url != '/api/login' && request.url != '/api/register') {
//     // if (request.url == '/api/addComment' && request.url == '/api/addMessage') {
//         //获取请求头的授权信息
//         let token=request.headers.token;
//         //密钥
//         let SECRET='laijunfa';
//         // 解密 token 获取对应的 id
//         jwt.verify(token, SECRET,(error,decoded)=>{
//             console.log(decoded);
//             if (error) { 
//                 //token失效或者token是伪造的
//                 response.send({
//                     code:403,
//                     msg:'登录已过期,请重新登录'
//                 });       
//             } else {
//                 next();
//             }
//         });
//     } else {
//         next();
//     }
// });

app.use(articleDao);
app.use(userDao);
app.use(commentDao);
app.use(messageDao);
app.use(questionDao);
//启动服务器
app.listen(6060, () => {
    console.log('服务器启动成功');
});