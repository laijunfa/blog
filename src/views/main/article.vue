<template>
  <div id="articleInfo">
      <div class="main">
          <article>
              <div class="article_hd">
                <h2 class="article_title"><a href="javascript:;">{{article.title}}</a></h2>
                <div class="details">
                    <span><img src="@/assets/img/index/icon/user.png" alt=""> {{article.u_nickname}}</span>
                    <span><img src="@/assets/img/index/icon/time.png" alt=""> {{moment(article.date).format('YYYY-MM-DD')}}</span>
                    <span><img src="@/assets/img/index/icon/read.png" alt=""> 浏览({{article.views}})</span>
                    <span><img src="@/assets/img/index/icon/comment.png" alt="">评论({{commentCount}})</span>
                    <span><img src="@/assets/img/index/icon/label.png" alt=""> {{article.art_sort}}</span>
                    <div class="operation" v-if="this.$store.state.userInfo.u_role==0">
                      
                      <span @click="openEdit">编辑</span>
                      <!-- 删除 -->
                      <span @click="delArticle">删除</span>
                    </div>
                </div>
              </div>
              <div class="article_content markdown-body" v-if="article" >
                  <div v-html="article.html"></div>
              </div>
              <!-- 评论(获取到文章数据后再显示评论) -->
              <comments v-if="article!=''" :articleId="article.id" @refresh="getCommentCount" type="评论"></comments>
          </article>
          <sidebar></sidebar>
          <!-- 文章编辑 -->
          <articleEdit v-if="article!=''" ref="articleEdit" @refresh="Details"></articleEdit>
      </div>
      <div class="accept">
        <div class="like" @click="like">
        </div>
         赞({{article.like_count}})
      </div>
  </div>
</template>

<script>
import moment from 'moment'
import sidebar from '@/components/sidebar.vue' //侧边栏
import comments from '@/components/comments.vue' //评论
import articleEdit from './com/articleEdit.vue' //文章编辑
import {getArticleDetailsApi,updateReadCountApi,updateLikeApi,delArticleApi } from '@/api/article.js'
// marked将markdown语法解析成html语法
import marked from 'marked'
export default {
  data() {
    return {
      marked,
      moment,
      article:'', //文章详情
      commentCount:'' //文章评论
    }
  },
  components:{
      sidebar,
      comments,
      articleEdit
  },
  created() {
      // 获取文章详情
      this.Details();
      //每次加载文章 更新一次阅读量
      this.updateReadCount();
  },
  methods: {
    //获取文章
    async Details(){
       let result=await getArticleDetailsApi(this.$route.query.id);
       if(result.data.code==200){
            this.article=result.data.data;
      }
    },
    //修改文章阅读量
    updateReadCount(){
      updateReadCountApi(this.$route.query.id).then(result=>{
        // console.log(result);
      })
    },
    //给文章点赞
    async like(){
      //先从cookie中获取用户信息
      let user=document.cookie.split('=')[1];
      let flag=false;
      if(user){
        user=JSON.parse(user);
        //判断用户是否点赞此文章
        flag=user.art_ids.includes(Number(this.$route.query.id));
        // user.ip==returnCitySN.cip //用户ip
        // userAgent:navigator.appName //浏览器名
        if(flag){
          this.$message.error('你已经点过赞了');
        }else{
          user.art_ids.push(Number(this.$route.query.id));
          //将点赞的文章id添加到cookie
          let obj={
            ip:returnCitySN.cip,
            art_ids:user.art_ids,
            appName:navigator.appName
          }
          obj=JSON.stringify(obj)
          //重新设置cookie
          document.cookie=`user=${obj}`
          let result=await updateLikeApi(this.article.id);
          if(result.data.code==200){
              this.article.like_count+=1;
          }
        }
      }else{
        //还没有点过赞
        let obj={
          ip:returnCitySN.cip,
          art_ids:[Number(this.$route.query.id)],
          appName:navigator.appName
        }
        obj=JSON.stringify(obj)
        document.cookie=`user=${obj}`
        let result=await updateLikeApi(this.article.id);
        if(result.data.code==200){
            this.article.like_count+=1;
        }
      }
      
    },
    //评论总数
    getCommentCount(value){
      this.commentCount=value;
    },
    //删除文章
    delArticle(){
       this.$confirm('你确定要删除这篇文章吗?').then(()=>{
        delArticleApi(this.article.id).then(result=>{
          if(result.data.code==200){
            this.$message.success('删除成功');
            this.$router.push('/main')
          }
        })
       }).catch(()=>{
        //  取消
       })
    },
    //打开编辑文章窗口
    openEdit(){
      this.$refs.articleEdit.dialogVisible=true;
      this.$refs.articleEdit.articleDetail=this.article;
    }
  },
};
</script>

<style lang="less">
@import url('../../style/main/article.css');
@import url('https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css');
// @import url('../../style/main/markdown.css');
</style>