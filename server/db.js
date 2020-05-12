const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',//数据库地址
    port: '3306',
    user: 'root',//用户名，没有可不填
    password: 'root',//密码，没有可不填
    database: 'blogs'//数据库名称
});

connection.connect();

module.exports=connection
