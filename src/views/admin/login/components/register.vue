<template>
  <div class="register">
    <!-- <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button> -->
    <el-dialog title="注册" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item  label="头像" prop="headImg" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="uploadImg"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname" :label-width="formLabelWidth">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phoneNum" :label-width="formLabelWidth">
          <el-input v-model="form.phoneNum" autocomplete="off" aria-placeholder="18823452828"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="17">
            <el-form-item label="图形码" prop="captcha" :label-width="formLabelWidth">
              <el-input v-model="form.captcha" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="captcha_box" :span="7">
            <img class="captchaImg" @click="changeSrc" :src="captchaSrc" alt />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17">
            <el-form-item label="验证码" prop="loginCode" :label-width="formLabelWidth">
              <el-input v-model="form.loginCode" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="captcha_box" :span="7">
            <el-button class="captcha_btn" @click="getSendCode" :disabled="isDisabled">
              <!-- 如果秒数等于0,显示获取用户验证码 -->
              {{second==0?"获取用户验证码":second}}
              </el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="resConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 在路径中写入 `@` ：相当于在 `src` 目录
import {smsCode,registerApi} from '@/api/register.js';
import {checkPhone,checkEmail} from '@/utils/mycheck.js';
export default {
  data() {
    return {
      captchaSrc:process.env.VUE_APP_BaseUrl +"/captcha?type=sendsms&k=" +
        Date.now(),
      // 控制对话框面板的打开和隐藏
      dialogFormVisible: false,
      form: {
        nickname: Date.now()+"a",
        email: Date.now()+"@qq.com",
        phoneNum: "18823452828",
        password: "123",
        captcha: "",
        loginCode: "",
        headImg:''
      },
      
      //配置验证规则
      rules: {
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail,trigger: "blur"}
        ],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        captcha: [{ required: true, message: "请输入图形码", trigger: "blur" }],
        loginCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ],
        headImg: [
          { required: true, message: "请添加头像", trigger: "blur" }
        ]
      },
      formLabelWidth: "70px",
      second:'',//秒数
      isDisabled:false,//是否禁用按钮
      imageUrl:'',//头像地址
      uploadImg:process.env.VUE_APP_BaseUrl+"/uploads" ,//头像上传路径
    };
  },
  methods: {
    // 更换图标验证码
    changeSrc() {
      this.captchaSrc =process.env.VUE_APP_BaseUrl+"/captcha?type=sendsms&k=" + Date.now();
      //线上
      // this.captchaSrc ="http://183.237.67.218:3002/captcha?type=sendsms&k=" + Date.now();
    },
    //获取短信验证码
    getSendCode() {
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!reg.test(this.form.phoneNum)) {
        this.$message.error('手机号码格式错误');
        //匹配失败
        console.log('匹配失败',reg.test(this.form.phoneNum));
        return;
      } 
      if(this.form.captcha.trim().length!=4 ){
          this.$message.error({
            message:"请输入4位数的验证码"
          })
          return;
      }
      //调用发送验证码api
      smsCode(this.form.captcha,this.form.phoneNum).then((result)=>{
        if(result.data.code==200){
           this.$message.success({
            message:'你的验证码为:'+result.data.data.captcha
          })
        }else{
           this.$message.error({
            message:result.data.message
          })
          return;
        }

        //倒计时
        this.second =60;
        this.isDisabled=true;//禁用按钮
        let timer=setInterval(()=>{
            this.second--;
            if(this.second==0){
              this.isDisabled=false;//启用按钮
              //清除倒计时
              clearInterval(timer);
            }
        },100)
      })
    },
    //注册确认按钮
    resConfirm() {
      // 验证参数的合法性
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.$message({
          //   message: "验证通过",
          //   type: "sucess"
          // });
          console.log(this.form);
          registerApi(this.form).then(result => {
            if(result.data.code==200){
                this.$message.success({
                    message:'注册成功'
                })
                //清空数据
                this.$refs.form.resetFields();
                this.imageUrl="";

            }else{
              this.$message.error({
                message:result.data.message
              })
            }
              console.log(result);
          });
        } else {
          this.$message.error("验证不通过");
        }
      });
    },
    //上传成功的回调函数
    handleAvatarSuccess(res, file) {  
        //给文件创建路径
        this.imageUrl=URL.createObjectURL(file.raw);
        console.log(this.imageUrl);
        
        //上传成功后保存服务器上图片地址
        this.form.headImg=res.data.file_path;
        console.log(res.data.file_path);
        //单一属性校验
        this.$refs.form.validateField('headImg');
    },
    //上传之前的回调函数
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png';
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
.register .el-dialog {
  width: 600px;
}
.register {
  //头部
  .el-dialog__header {
    padding: 0;
    background: linear-gradient(
      225deg,
      rgba(20, 147, 250, 1),
      rgba(1, 198, 250, 1)
    );
    height: 53px;
    text-align: center;
    .el-dialog__title {
      line-height: 53px;
      color: #fff;
    }
  }
  .captcha_box {
    text-align: right;
    .captchaImg,
    .captcha_btn {
      width: 143px;
      height: 41px;
    }
  }
  // 底部
  .dialog-footer {
    text-align: center;
  }

  //上传头像
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
</style>