<template>
  <div class="message">
    <el-card>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="用户名称">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="全部" value></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="已通过" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMessageList">搜索</el-button>
          <el-button type="primary" @click="clear">清除</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格 -->
    <el-card class="user_table">
      <el-table text-align="center" :data="tableData" style="width: 100%">
        <el-table-column  type="index" label="序号"></el-table-column>
        <el-table-column prop="u_nickname" label="用户名"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="time" label="留言日期">
          <template slot-scope="scope">
            {{$moment(scope.row.time).format('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.status=='0'">未审核</el-tag>
              <el-tag type="success" v-else>通过</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link v-if="scope.row.status==0" type="primary" @click="changeStatus(scope.row)">通过</el-link>&nbsp;
            <el-link v-else type="primary" disabled>已通过</el-link>&nbsp;
            <el-link type="primary" @click="delMessage(scope.row,index)">删除</el-link>
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
  </div>
</template>
<script>
import {getMessageListApi,changeMsgStatusApi,delMessageApi} from '@/api/message.js'
export default {
  data() {
    return {
      form: {
        username: "",
        status:"",
        remark:"",
        page:1,//当前页
        pageSize:5,//页容量
      },
      total:20,//总数量
      tableData: [] //表格的数据
    };
  },
  created() {
    this.getMessageList();
  },
  methods: {
    
    //删除用户
     delMessage(row){
      this.$confirm('你确定要删除该留言吗吗?').then(async()=>{
        let result=await delMessageApi(row.id);
        if(result.data.code==200){
          this.$message.success({message:'删除成功'})
          if(this.tableData.length==1){
              this.form.page=1;//改变当前页
          }
          this.getMessageList();
        }
      }).catch(()=>{
        console.log('取消');
      })
    },
    //改变状态
    changeStatus(row){
      changeMsgStatusApi(row.id).then(result=>{
        if(result.data.code==200){
            this.$message.success({message:'审核成功'})
            row.status=1;
        }
      });
    },
    //获取用户数据
    async getMessageList(){
        let result=await getMessageListApi(this.form);
        if(result.data.code==200){
            this.tableData=result.data.data;
            this.total=result.data.total;
        }
    },
    //清除筛选
    clear(){
        this.form.username="",
        this.form.email="",
        this.form.role=""
    },
    onSubmit() {
      console.log("submit!");
    },
    //页容量改变触发事件
    handleSizeChange(val) {
      this.form.pageSize=val;
      this.getMessageList();
    },
    //当前页改变触发事件
    handleCurrentChange(val) {
      this.form.page=val;
      this.getMessageList();
    }
  },
};
</script>

<style lang="less">
.message {
  .user_table {
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