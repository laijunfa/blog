<template>
  <div class="article">
    <el-card>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="文章标题称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select v-model="form.sort_id">
            <el-option
              v-for="item in artSorts"
              :key="item.id"
              :label="item.name"
              :ishljs="true"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getArticleList">搜索</el-button>
          <el-button type="primary" @click="clear">清除</el-button>
          <el-button type="primary" @click="openAdd">
            <i class="el-icon-plus"></i>新增文章
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格 -->
    <el-card class="article_table">
      <el-table text-align="center" :data="tableData" style="width: 100%">
        <el-table-column  type="index" label="序号"></el-table-column>
        <el-table-column prop="title" label="文章标题"></el-table-column>
        <el-table-column prop="art_sort" label="文章类型"></el-table-column>
        <el-table-column prop="date" label="发布日期">
          <template slot-scope="scope">
            {{$moment(scope.row.date).format('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column  label="状态" >
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.status=='0'">私密</el-tag>
              <el-tag type="success" v-else>公开</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-link type="primary" @click="openEdit(scope.row)" icon="el-icon-edit">编辑</el-link>&nbsp;
            <el-link v-if="scope.row.status==0" type="success" @click="changeStatus(scope.row)" >公开
            </el-link>&nbsp;
            <el-link v-else type="warning" @click="changeStatus(scope.row)" >私密
            </el-link>&nbsp;
            <el-link type="primary" @click="delArticle(scope.row)">删除</el-link>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page"
          :page-sizes="[5, 10, 15]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <articleEdit ref="articleEdit" @refresh="getArticleList"></articleEdit>
  </div>
</template>
<script>
import {getArticleListApi,changeArtStatusApi,delArticleApi,getArticleSortApi} from '@/api/article.js'
import articleEdit from '../../main/com/articleEdit' //新增文章
export default {
  data() {
    return {
      form: {
        title: "",
        sort_id:"",
        page:1,//当前页
        pageSize:5,//页容量
      },
      total:0,//总数量
      tableData: [], //表格的数据
      artSorts:[]
    };
  },
  created() {
    this.getArticleList();
    this.getArticleSort();
  },
  methods: {
     // 打开新增文章
    openAdd(){
      console.log(this.$store.state.userInfo);
      if(this.$store.state.userInfo.u_role!=0){
        this.$message.error('无权添加')
        return
      }
      this.$refs.articleEdit.dialogVisible=true;
      this.$refs.articleEdit.articleDetail=null;
    },
    //打开编辑文章窗口
    openEdit(row){
      console.log(row);
      this.$refs.articleEdit.articleDetail=row;
      this.$refs.articleEdit.dialogVisible=true;
    },
    async getArticleSort(){
      let result=await getArticleSortApi();
      this.artSorts=result.data.data;
    },
    //添加文章
    addArticle(){
    },
    //删除文章
    delArticle(row){
      this.$confirm('你确定要删除该文章吗?').then(async()=>{
        let result=await delArticleApi(row.id);
        if(result.data.code==200){
          this.$message.success({message:'删除成功'})
          if(this.tableData.length==1){
              this.form.page=1;//改变当前页
          }
          this.getArticleList();
        }
      }).catch(()=>{
        console.log('取消');
      })
    },
    //改变文章状态
    async changeStatus(row){
        let result=await changeArtStatusApi({
          id:row.id,
          status:row.status=row.status==1?0:1
        })
        if(result.data.code==200){
            this.$message.success({message:'改变状态成功'})
        }
    },
    //获取文章数据
    async getArticleList(){
        let result=await getArticleListApi(this.form);
        if(result.data.code==200){
            this.tableData=result.data.data;
            this.total=result.data.total;
        }
    },
    //清除筛选
    clear(){
        this.form.title="",
        this.form.sort_id=""
    },
    onSubmit() {
      console.log("submit!");
    },
    //页容量改变触发事件
    handleSizeChange(val) {
      this.form.pageSize=val;
      this.getArticleList();
    },
    //当前页改变触发事件
    handleCurrentChange(val) {
      this.form.page=val;
      this.getArticleList();
    }
  },
  components:{
    articleEdit
  }
};
</script>

<style lang="less">
.article {
  .article_table {
    margin-top: 20px;
  }
  .el-table td,.el-table th{
    text-align: center;
  }
  .el-pagination{
    margin-top: 20px;
    text-align: center;
  }
}
</style>