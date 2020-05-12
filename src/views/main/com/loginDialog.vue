<template>
  <div class="login-dialog">
    <el-dialog title="登录" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="ruleForm.account" placeholder="登录账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="ruleForm.password" placeholder="请输入你的密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="login()">登录</el-button>
          <el-button @click="openRegister()">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {loginApi} from '@/api/user.js'
export default {
  data() {
    return {
      dialogFormVisible: false,
      ruleForm: {
        account:"admin",
        password:"",
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 跳转到注册
    openRegister(){
      this.dialogFormVisible=false;
      this.$parent.openRegister();
    },
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
              this.dialogFormVisible=false;
              this.$emit("refresh");
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
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>

<style lang="less">
.login-dialog {
  .el-dialog {
    width: 500px;
    .el-dialog__header{
      text-align: center;
      background-color: skyblue;
    }
  }
  .demo-ruleForm{
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>