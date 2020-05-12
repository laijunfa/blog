<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="carousel bx">
        <el-carousel :interval="5000" height="260px" arrow="always">
          <el-carousel-item v-for="item in carouselImgs" :key="item">
            <img width="100%"  :src="item" alt="">
          </el-carousel-item>
        </el-carousel>
        <!-- <carousel></carousel> -->
    </div>
    <div class="main bx">
      <div class="main_left">
        <!-- 子导航 -->
        <el-menu active-text-color="#00a8ff" default-active="0" class="el-menu-demo" mode="horizontal">
          <el-menu-item :index="index+''" v-for="(item, index) in articleSorts" @click="handleSelect(item)" :key="index">{{item.name}}</el-menu-item>
          <el-menu-item><el-link type="primary" :underline="false" icon="el-icon-edit" @click="openAdd">新增文章</el-link></el-menu-item>
        </el-menu>
        <!-- 文章列表 -->
        <section class="section" >
          <article v-for="item in articleList" :key="item.id">
            <div >
              <div class="article_left"><a href="#"><img :src="'http://'+item.imgUrl" alt=""></a></div>
              <div class="article_right">
                  <h4 class="article_title">
                    <a href="javascript:;" @click="toArticleDetail(item.id)">{{item.title}}</a>
                    <!-- 置顶 -->
                    <span v-if="item.isTop==1" class="is-top">[置顶]</span> 
                  </h4>
                    
                  <div class="detail" v-html="item.html"></div>
                </div>
              </div>
            <div class="article_bottom">
                <div>
                  <span><img src="@/assets/img/index/icon/time.png" alt="">{{moment(item.date).format('YYYY-MM-DD')}}</span>
                  <span><img src="@/assets/img/index/icon/read.png" alt="">浏览({{item.views}})</span>
                  <span><img src="@/assets/img/index/icon/like.png" alt="">赞({{item.like_count}})</span>
                   <span><img src="@/assets/img/index/icon/label.png" alt="">{{item.art_sort}}</span>
                </div>
                <a href="javascript:;" @click="toArticleDetail(item.id)">阅读全文</a>
            </div>
          </article>
        </section>
        <!-- 分页器 -->
        <div v-if="total>=5">
          <el-pagination background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="obj.page"
            :page-size="obj.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <div v-else-if="total==0">
          <el-card>暂无文章</el-card>
        </div>
      </div>
      <addArticleDg ref="addArticleDg" @refresh="getArticle"></addArticleDg>
      <!-- 侧边栏 -->
      <sidebar></sidebar>
      <!-- <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=450 src="//music.163.com/outchain/player?type=0&id=4931300322&auto=1&height=430"></iframe> -->
    </div>
  </div>
</template>
<script>
import moment from 'moment' //日期插件
import sidebar from '@/components/sidebar.vue' //侧边栏
import {getArticleListApi,getArticleSortApi} from '@/api/article.js'
import addArticleDg from './com/articleEdit.vue' //新增文章
// import carousel from '../../components/carousel.vue'
export default {
  data() {
    return {
      moment,
      carouselImgs:[
            'http://pic1.win4000.com/wallpaper/2020-04-15/5e96d70c010e4.jpg',
            'https://cdn.jsdelivr.net/gh/syfxlin/pic/index/assets/img/2.jpg',
            'https://cdn.jsdelivr.net/gh/syfxlin/pic/index/assets/img/3.jpg',
      ],
      articleList:[], //文章集合,
      articleSorts:[],
      obj:{
        page:1,
        pageSize:5
      },
      total:0
    }
  },
  created() {
    this.getArticle()
    this.getArticleSort();
  },
  methods: {
    async getArticleSort(){
      let result=await getArticleSortApi();
      if(result.data.code==200){
        for (let i = 0; i < result.data.data.length; i++) {
          let obj=result.data.data[i];
          if(obj.name=="HTML" || obj.name=="CSS"){
            result.data.data.splice(i,1);
            i--;
          }
        }
        this.articleSorts=result.data.data;
        this.articleSorts.unshift({name:'全部',id:0})
      }
    },
    // 打开新增文章
    openAdd(){
      if(this.$store.state.userInfo.u_role!=0){
        this.$message.error('无权添加')
        return
      }
      this.$refs.addArticleDg.dialogVisible=true;
      this.$refs.addArticleDg.articleDetail=null;
    },
    handleSelect(item) {
      if(item.id===0){
        delete this.obj.sort_id;
      }else{
        this.obj.sort_id=item.id;
      }
      this.getArticle();
    },
    //获取文章
    getArticle(){
      getArticleListApi(this.obj).then(result=>{
        if(result.data.code==200){
          this.articleList=result.data.data;
          this.total=result.data.total;
        }
      })
    },
    //跳转到文章详情
    toArticleDetail(id){
      this.$router.push({
        path:'article',
        query:{id}
      })
    },
    //页容量改变触发事件
    handleSizeChange(val) {
      this.obj.pageSize=val;
      this.getArticle();
    },
    //当前页改变触发事件
    handleCurrentChange(val) {
      this.obj.page=val;
      this.getArticle();
    }
  },
  components: {
    sidebar,
    addArticleDg,
    // carousel
  }
};
</script>

<style lang="less" >
@import url("../../style/main/home.css");




</style>