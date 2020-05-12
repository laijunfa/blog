//验证手机号码格式
let checkPhone=(rule, value, callback)=>{
    let reg=/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
    // 判断输入的值是否匹配这个正则
    if(reg.test(value)){
        callback(); // 继续向后执行
    }else{
        // 说明匹配不成功
        callback(new Error('手机格式错误'))
    }
}
//验证邮箱
let checkEmail=(rule,value,callback)=>{
    let reg=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if(reg.test(value)){
        callback()
    }else{
        callback(new Error('邮箱格式错误'))
    }
}
export  {checkPhone,checkEmail}