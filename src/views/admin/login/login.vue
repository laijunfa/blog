<template>
  <div class="login">
    <img class="login_left" src="../../../assets/img/login/login_banner_ele.png" alt="">
    <div class="login_right">
        <h3 class="title">
          <img src="../../../assets/img/login/icon.png" class="icon" alt="">
          <span>后台管理系统</span>
          <span class="line"></span>
          <span>用户登录</span>
        </h3>
        <div>
          <div class="element_input">
            <!--login表单  -->
            <el-form ref="ruleForm" :rules="rules"  class="loginForm" :model="ruleForm" label-width="0px">
              <el-form-item prop="account">
                <el-input placeholder="请输入账号" prefix-icon="el-icon-user" v-model="ruleForm.account"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input placeholder="请输入密码" type="password" prefix-icon="el-icon-lock" v-model="ruleForm.password"></el-input>
              </el-form-item>  
            
              <el-form-item>
                <el-button type="primary" class="login-btn" @click="login()">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
// import register from './components/register.vue';//导入注册组件
import {checkPhone} from '@/utils/mycheck.js'
import {loginApi} from '@/api/user.js'
import local from '@/utils/localStorage.js'
export default {
  data() {
    return {
      ruleForm:{
        account: "",
        password: "",
      },
      rules:{
        // 验证规则
        account:[
          {required:true,message:'请输入账号',trigger:'blur'},
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'}
        ],
      },
    };
  },
  methods: {
     login() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          let result=await loginApi(this.ruleForm);
          // console.log(result.data);
          if(result.data.code==200){
              this.$message.success({
                message:'登录成功'
              })
              let token=result.data.token;
              // local.set('token',token);
              let userInfo=result.data.data[0];
              userInfo.token=token;
               //保存用户登录信息到vuex和本地
              this.$store.commit('setUserInfo',userInfo)
              
              this.$router.push('/admin')
          }else if(result.data.code==201){
            this.$message.error({
                message:'用户名或密码错误',
            })
          }else{
            this.$message.error({
                message:'服务器错误,请联系站长',
            })
          }
        } else {
          this.$message({
            message:'验证不通过',
            type:'error'
          })
        }
      });
    },
    
}
};
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    225deg,
    rgba(20, 147, 250, 1),
    rgba(1, 198, 250, 1)
  );
  display: flex;
  justify-content: space-around;//两端平均分布
  align-items: center; //居中对齐
  .login_left{
    width: 633px;
    height: 435px;
  }
  .login_right{
    width: 400px;
    height: 350px;
    background: rgba(245, 245, 245, 1);
    padding: 50px 41px 48px;
    .el-button{
      width: 100%;
    }
    .title{
      font-size: 20px;
      display: flex;
      margin-bottom: 20px;
      align-items: center;
      font-weight: normal;
      .icon{
        width: 22px;
        height: 17px;
        margin-right: 10px;
      }
      .line{
        display: inline-block;
        width:1px;
        height:25px;
        background:rgba(199,199,199,1);
        margin:0 12px;
      }
    }
  }
  // .el-form-item__content{
  //   margin-top: 10px;
  // }
}
</style>