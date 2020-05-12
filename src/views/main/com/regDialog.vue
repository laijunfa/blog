<template>
  <div class="register-dialog">
    <el-dialog title="注册" :visible.sync="dialogFormVisible">
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
        <el-form-item label="昵称">
          <el-input v-model="ruleForm.nickname" placeholder="你的网名(选填)"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="ruleForm.password" placeholder="请记住你的密码"></el-input>
        </el-form-item>
        <!-- http://localhost:6060/api/upload/avatar -->
        <el-form-item label="头像(选填)" >
          <el-upload
            class="avatar-uploader"
            action="http://106.14.155.113:6060/api/upload/avatar"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="register()">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {registerApi,checkRegisterApi} from '@/api/user.js'
export default {
  data() {
    return {
      dialogFormVisible: false,
      ruleForm: {
        ip:'',
        account:"18823452832",
        nickname:'',
        password:"",
        imageUrl: '',
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
           { validator: this.checkUser, trigger: 'blur' }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    register() {
      console.log('zhuce ');
      
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          this.ruleForm.ip=returnCitySN.cip;
          if(this.ruleForm.nickname.trim()==''){
            this.ruleForm.nickname=this.ruleForm.account
          }
          console.log(this.ruleForm);
          let result=await registerApi(this.ruleForm);
            if(result.data.code==200){
              this.$message.success({
                message:'注册成功'
              })
              console.log(result.data);
              let token=result.data.token;
              // local.set('token',token);
              let userInfo=result.data.data;
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
    async checkUser(rule, value, callback){
      let result=await checkRegisterApi(this.ruleForm.account);
      console.log(result);
      if(result.data.code==201){
        callback(new Error('账号已被注册'));
      }else {
        callback();
      }
    },
    //头像上传成功后
    handleAvatarSuccess(res, file) {
      this.ruleForm.imageUrl='http://'+res.imgUrl;
      console.log(this.ruleForm.imageUrl);
    },
    //上传头像前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/jpg'|| 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="less">
.register-dialog {
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