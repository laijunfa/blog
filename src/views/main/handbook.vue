<template>
  <el-container class="hondbook">
    <el-aside width="270px">
      <el-menu default-active="HTML" class="el-menu-vertical-demo">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>前端</span>
          </template>
           <!-- 面试类型 -->
           <div v-for="item in interviewTypes" :key="item.id" @click="getArticleById(item.id)">
            <el-menu-item  v-if="item.name!='Java'"  :index="item.name">
              <span slot="title"  >{{item.name}}</span>
            </el-menu-item>
           </div>
          <!-- disabled -->
          <el-menu-item >
            <span slot="title"><i class="el-icon-plus"></i><el-link :underline="false" type="warning" @click="addSort">添加分类</el-link></span>
          </el-menu-item>
        </el-submenu>
        <!-- 后端 -->
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>后端</span>
          </template>
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">Java</span>
          </el-menu-item>
        </el-submenu>
        <!-- 数据库 -->
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>数据库</span>
          </template>
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">Mysql</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <!-- 右侧内容 -->
        <div>
          <div class="operation" v-if="curArticle && $store.state.userInfo.u_role==0">
            <span>发布于 2020-04-11</span>
            <span @click="openEdit">编辑</span>
            <span @click="delArticle">删除</span>
          </div>
          <!-- 展示文章内容 -->
          <div class="art_content" v-if="curArticle"  >
            <div class="markdown-body" v-html="marked(curArticle.content)"></div>
          </div>
          <div v-else>
            <el-button type="primary" plain icon="el-icon-edit" @click="openEdit" >添加内容</el-button>
          </div>
        </div>
    </el-main>
    <addSortCpn ref="addSortCpn" @refresh="getInterviewType"></addSortCpn>
    <articleEdit v-if="curArticle!=''" ref="articleEdit" @refresh="getArticleById(artSortId)" ></articleEdit>
  </el-container>
</template>

<script>

import {addArticleApi,getArticleSortApi} from '@/api/article.js';
import {getInterviewArticleApi,editArticleApi,delArticleApi} from '@/api/article.js';
import articleEdit from './com/articleEdit.vue' //文章编辑
import addSortCpn from './com/addSortDialog'
// marked将markdown语法解析成html语法
import marked from 'marked'
export default {
  data() {
    return {
      marked,
      interviewTypes:[],
      artSortId:1,
      curArticle:'', //当前文章
      title:''
    };
  },
  components:{
    addSortCpn,
    articleEdit
  },
  created() {
    this.getInterviewType();
    // this.getArticleById(this.artSortId);
  },
  methods: {
    addSort(){
      if(this.$store.state.userInfo.u_role!=0){
        this.$message.error('无权添加')
        return
      }
      this.$refs.addSortCpn.dialogFormVisible=true;
    },
    //获取所有面试类型
    getInterviewType(){
        getArticleSortApi().then(result=>{
           //获取类型
           this.interviewTypes=result.data.data;
          //  console.log(result.data.data);
        })
    },
    //删除文章
    delArticle(){
      this.$confirm('你确认要删除这篇文章吗?').then(()=>{
        delArticleApi(this.curArticle.id).then(result=>{
          if(result.data.code==200){
            this.$message.success('删除成功')
            //清空文章
            this.curArticle='';
          }else{
            this.$message.error('删除失败');
          }
        })
      })
    },
    //打开编辑文章
    openEdit(){
       if(this.$store.state.userInfo.u_role!=0){
        this.$message.error('无权添加')
        return
      }
      this.$refs.articleEdit.dialogVisible=true;
      this.$refs.articleEdit.artSortId=this.artSortId;//文章类型
      this.$refs.articleEdit.isInterview=1;//面试文章
      this.$refs.articleEdit.articleDetail=this.curArticle;
    },
    //根据面试类型id查询文章
    getArticleById(id){
      this.artSortId=id;
      getInterviewArticleApi(id).then(result=>{
        if(result.data.code==200){
          this.curArticle=result.data.data[0];
        }
      })
      // console.log(this.curArticle);
    },
  },
};
</script>
<style lang="less">
@import url('https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css');
.el-container {
  height: 100%;
  width: 80%;
  margin: 0 auto;
}
.hondbook{
   margin-top: 10px;
    height: 700px;

    .el-aside {
      background-color: #fff;
      color: #333;
      .el-menu{
        height: 100%;
      }
    }
    .el-main {
      background-color: #fff;
      color: #333;
      .operation{
        margin-bottom: 20px;
        span{
          color: #45B6F7;
          font-size: 13px;
          padding-right:10px;
          cursor: pointer;
        }
      }
      .edit{
        margin-top: 20px;
        .btn{
          margin-left: 100px;
          .el-button{
            margin: 0 10px;
          }
        }
      }
    }
}

</style>