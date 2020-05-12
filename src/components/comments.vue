<template>
  <div>
    <div class="comment">
      <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-row v-if="isVisitor" type="flex" justify="space-between">
          <el-col :span="1">
            <el-popconfirm title="你处于访客模式,你要登录吗" @onConfirm="openLogin">
              <div slot="reference" ref="popconfirm" class="caller">
                <span>访</span>
              </div>
            </el-popconfirm>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="username">
              <el-input placeholder="访客昵称" v-model="form.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="userUrl">
              <el-input placeholder="个人网站(选填)" v-model="form.userUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col>
            <span>欢迎你,</span>
            <el-link type="primary">{{$store.state.userInfo.u_nickname}}</el-link>
             <el-button type="warning" plain @click="logout" class="logout"  size="mini">注销</el-button>
          </el-col>
        </el-row>
        <el-form-item prop="content">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            resize="none"
            v-model="form.content"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="com_btn">
          <el-button type="primary" size="mini" @click="submit">{{type}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 留言列表 -->
    <div class="msg_list">
      <div class="msg_top">
        <h3>{{type}}列表</h3>
        <span>
          共
          <b>{{total}}</b> 条{{type}}
        </span>
      </div>
      <div class="msg_item" v-for="(item, index) in commentList" :key="index">
        <div class="wrap">
          <a class="avatar" :href="item.url" target="_blank" title="他的网站">
            <!-- 用户 -->
            <div v-if="item.u_avatar">
              <img :src="item.u_avatar" alt />
            </div>
            <!-- 没有头像的用户 -->
            <div v-else class="caller">
              <!-- 普通用户 -->
              <span v-if="item.u_id">{{item.u_nickname.substring(0,1)}}</span>
              <!-- 访客 -->
              <span v-else>{{item.visitor.substring(0,1)}}</span>
            </div>
            
          </a>
          <div class="msg_content">
            <div class="msg_hd">
              <div class="user">
                <span class="user_name">
                  <a href="javascript:;">{{item.u_id!=null?item.u_nickname:item.visitor}}</a>
                </span>
                <span
                  v-if="item.u_id && item.u_id!=1"
                  class="level level1"
                  title="等级 Lv.1"
                >Lv 1</span>
                <span v-else-if="item.u_id==null" class="level caller" title>访客</span>
                <span v-else class="level admin" title="管理员">站长</span>
              </div>
              <div class="msg_time">
                <el-button v-if="item.status==0" class="status" type="danger" size="mini" @click="pass(item.id)">未通过</el-button>
                <div>#{{item.id}} {{moment(item.time).format('YYYY-MM-DD HH:mm')}}</div>
              </div>
            </div>
            <div class="msg_bd">
              {{item.content}}
              <span v-if="$store.state.userInfo.u_role==0" class="reply" @click="openReply(item)"><i class="iconfont icon-huifu"></i> 回复</span>
            </div>
          </div>
        </div>
        <!-- 子评论 -->
        <el-collapse v-model="activeNames" >
          <el-collapse-item v-if="item.replys.length>0" :title="'共'+item.replys.length+'条回复'" :name="item.id">
            <div class="child_comments" v-for="(item2, index2) in item.replys" :key="index2">
              <div class="avatar">
                  <img :src="item2.u_avatar" alt="">
              </div>
              <div class="msg_content">
                  <div class="msg_hd">
                      <span class="user">
                          <span class="user_name"><a href="javascript:;">{{item2.u_nickname}}</a></span>
                          <span class="level admin" title="管理员">站长</span>
                      </span>
                      <span class="msg_time">2020-03-30 11:28:56 </span>
                  </div>
                  <div class="msg_bd">
                      <span class="reply_user">@{{item2.reply_name}}</span>
                      <span>{{item2.content}}</span>
                  </div>
              </div>
            </div>
          </el-collapse-item>
          <div class="com_reply" v-if="curCommentId==item.id">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                resize="none"
                v-model="replyMsg"
              ></el-input>
              <div class="reply-bottom">
                <el-button type="primary" size="mini" @click="reply(item)">回复</el-button>
              </div>
          </div>
        </el-collapse>
      </div>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="obj.page"
          :page-size="obj.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <loginDialog ref="loginDialog" @refresh="refresh"></loginDialog>
    <regDialog ref="regDialog" @refresh="refresh"></regDialog>
  </div>
</template>

<script>
import moment from "moment";
import local from "../utils/localStorage";
import { addCommentApi, getCommentsApi,changeComStatusApi,addComReplyApi } from "@/api/comment.js";
import { getMessageListApi, addMessageApi,changeMsgStatusApi } from "@/api/message.js";
import loginDialog from "../views/main/com/loginDialog";
import regDialog from "../views/main/com/regDialog";

export default {
  data() {
    return {
      moment,
      isVisitor: true, //是否访客
      form: {
        username: "", //用户名
        userUrl: "", //个人网站
        content: "" //评论内容
      },
      rules: {
        username: [
          { required: true, message: "昵称不能为空", trigger: "blur" }
        ],
        content: [{ required: true, message: "评论不能为空", trigger: "blur" }]
      },
      commentList: [], //评论集合
      obj: {
        articleId: 0,
        status:1,
        page: 1, //当前页面
        pageSize: 5 //页面容量
      },
      total: 0, //评论总数量
      curCommentId:-1,
      replyMsg:'', //回复内容
      activeNames:['1']
    };
  },
  props: ["articleId", "type"],
  components: {
    loginDialog,
    regDialog
  },
  created() {
    this.obj.articleId = this.articleId;
    if (this.type == "留言") {
      this.getMessageList();
    } else {
      this.getCommentList();
    }
  },
  mounted() {
    if(!this.$store.state.userInfo.token){
      this.$refs.popconfirm.click();
      this.isVisitor=true
    }
  },
  methods: {
    // 展开回复评论
    openReply(item){
      if(this.curCommentId==item.id){
        // 再次点击收起评论
        this.curCommentId=-1
      }else{
        this.curCommentId=item.id;
      }
    },
    async reply(item){
      let obj={
        comment_id:item.id,
        type:0,
        reply_name:item.u_nickname,
        content:this.replyMsg
      }
      if(item.visitor){
        obj.reply_name=item.visitor
      }
      if(this.$store.state.userInfo.u_id){
        obj.u_id=this.$store.state.userInfo.u_id
      }
      if(this.type=="留言"){
        obj.type=1
      }
      // 回复留言
      let result=await addComReplyApi(obj);
      if(result.data.code==200){
        this.$message.success('回复成功');
        this.curCommentId=-1;
        this.replyMsg='';
        this.visitor='';
        this.refresh();
      }else{
        this.$message.error('回复失败');
      }
    },
    //刷新
    refresh(){
      if(this.type=="留言"){
        this.getMessageList();
      }else{
        this.getCommentList();
      }
    },
    // 退出
    logout(){ 
      window.localStorage.removeItem('userInfo');
      this.$store.commit('setUserInfo',{})
      this.isVisitor=true;
      //清空form
      this.form={}
      this.obj.status=1
      if(this.type=="留言"){
        this.getMessageList();
      }else{
        this.getCommentList();
      }
    },
    async pass(id){
      let result='';
      if (this.type == "留言") {
         result=await changeMsgStatusApi({id});
          this.getMessageList();
      } else {
        // 评论状态
         result=await changeComStatusApi({id});
         this.getCommentList();
      }
      if(result.data.code==200){
        this.$message.success('已通过');
      }
    },
    openLogin() {
      this.$refs.loginDialog.dialogFormVisible = true;
    },
    openRegister(){
      this.$refs.regDialog.dialogFormVisible = true;
    },
    //获取文章的评论
    getCommentList() {
      if(this.$store.state.userInfo.token){
        this.isVisitor=false
      }
       if(this.$store.state.userInfo.u_role==0){
        this.obj.status=null;
      }
      getCommentsApi(this.obj).then(result => {
        if (result.data.code == 200) {
          this.commentList = result.data.data;
          this.total = result.data.total;
          this.$emit("refresh", this.total);
        }
      });
    },
    //留言列表
    getMessageList() {
      if(this.$store.state.userInfo.token){
        // this.$refs.popconfirm.click();
        this.isVisitor=false
      }
      if(this.$store.state.userInfo.u_role==0){
        this.obj.status=null;
      }
      getMessageListApi(this.obj).then(result => {
        this.commentList = result.data.data;
        this.total = result.data.total;
      });
    },
    // 评论or留言
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          //验证成功
          let obj = {
            u_id: null,
            articleId: this.$route.query.id,
            content: this.form.content,
            visitor: this.form.username,
            userUrl:this.form.userUrl,
            status:0
          };
          let userInfo = local.get('userInfo');
          if (userInfo.token) {
            //token存在说明已登录
            obj.u_id = userInfo.u_id;
          }
          if (this.type == "留言") {
            addMessageApi(obj).then(result => {
              if (result.data.code == 200) {
                this.textarea = "";
                this.getMessageList();
                this.$message.warning("留言成功,待审核");
              } else {
                this.$message.error(result.data.msg);
              }
            });
          } else {
            //评论
            addCommentApi(obj).then(result => {
              if (result.data.code == 200) {
                this.textarea = "";
                this.getCommentList();
                this.$message.warning("评论成功,待审核");
              } else {
                this.$message.error(result.data.msg);
              }
            });
          }
          this.form.content=''
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //当前页面发生改变
    handleCurrentChange(page) {
      this.obj.page = page;
      if (this.type == "留言") {
        this.getMessageList();
      } else {
        this.getCommentList();
      }
    }
  }
};
</script>

<style lang="less">
@import url('http://at.alicdn.com/t/font_1777473_sngtlfqr24k.css');
// #comment
//留言
.comment {
  width: 770px;
  height: 220px;
  // border: 1px solid red;
  margin-top: 100px;
  position: relative;
  .com_btn{
    .el-button {
      position: absolute;
      right: 0;
      bottom: -12px;
    }
  }
  .logout{
    margin-left: 20px;
  }
}
// 访客
.caller {
  cursor: pointer;
  width: 45px;
  height: 45px;
  font-size: 18px;
  border-radius: 50%;
  background-color: skyblue;
  color: #fff;
  text-align: center;
  span {
    line-height: 40px;
  }
}
//留言列表
.msg_list {
  width: 770px;
  margin-top: 30px;
  padding: 5px;
  .msg_top {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid darkgray;
    padding: 10px 0;
    b {
      font-weight: normal;
      color: #66b1ff;
    }
  }
}
//
.msg_item {
  border-bottom: 1px dashed #e5e5e5;
  padding: 20px 0 20px 0;
  //评论
  .wrap,
  .child_comments {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    .avatar {
      width: 45px;
      height: 45px;
      margin-right: 3px;
      display: inline-block;
      img {
        width: 45px;
      height: 45px;
        border-radius: 50%;
        cursor: pointer;
      }
    }
    .msg_content {
      width: 700px;
      color: #333;
      .msg_hd {
        display: flex;
        justify-content: space-between;
        
        .user {
          color: #5755d9;
          .level {
            margin-left: 5px;
            color: #fff;
            font-size: 12px;
            padding: 0px 5px;
            border-radius: 2px;
            opacity: 0.5;
          }
          //普通用户
          .level1 {
            background-color: #348be8;
          }
          //管理员
          .admin {
            background-color: #fd5d3c;
          }
          // 访客
          .caller {
            background-color: #cbbbba;
          }
          .level:hover {
            cursor: pointer;
            opacity: 1;
          }
        }
        .msg_time {
          .el-button{
            padding: 3px 5px;
            font-size: 11px;
          }
          color: silver;
          font-size: 13px;
          display: flex;
        }
      }
      .msg_bd {
        position:relative;
        width: 600px;
        margin-top: 10px;
        word-wrap: break-word;
        .reply{
          position: absolute;
          right: -70px;
          top: 0;
          color:#409EFF;
          cursor: pointer;
        }
      }
    }
  }
  // 子评论
  .child_comments {
    margin: 20px 0px 0px 50px;
    border-top: 1px dashed #e5e5e5;
    .msg_content {
      width: 650px;
    }
    .reply_user {
      color: #409EFF;
      margin-right: 10px;
    }
  }
  //回复
  .com_reply{
    margin: 20px 0px 20px 50px;
    width: 650px;
    .reply-bottom{
      position: relative;
      margin-top: 10px;
      .el-button{
        position: absolute;
        right: 0;
      }
    }
  }
  // 展开评论
  .el-collapse-item__wrap{
    border: 0;
  }
  .el-collapse-item__content{
    padding-bottom: 0;
    line-height: 1.5;
  }
  .el-collapse{
    border: 0;
    margin-left: 60px;
  }
  .el-collapse-item__header{
    display: inline-block;
    height: 0;
    line-height: 0;
    border: 0;
  }
}
</style>