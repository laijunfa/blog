<template>
  <div class="userlist">
    <el-card>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="用户名称">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="注册日期">
          <el-input v-model="form.time"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role_id">
            <el-option label="全部" value></el-option>
            <el-option label="超级管理员" value="0"></el-option>
            <el-option label="普通用户" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserList">搜索</el-button>
          <el-button type="primary" @click="clear">清除</el-button>
          <el-button type="primary" @click="addUser">
            <i class="el-icon-plus"></i>新增用户
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格 -->
    <el-card class="user_table">
      <el-table text-align="center" :data="tableData" style="width: 100%">
        <el-table-column  type="index" label="序号"></el-table-column>
        <el-table-column prop="u_nickname" label="用户名"></el-table-column>
        <el-table-column prop="u_phone" label="电话"></el-table-column>
        <el-table-column prop="u_register_time" label="注册日期">
          <template slot-scope="scope">
            {{$moment(scope.row.u_register_time).format('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column prop="u_role" label="角色">
          <template slot-scope="scope">
            {{scope.row.u_role==1?'普通用户':'管理员'}}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column  label="状态" >
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status=='0'">启用</el-tag>
              <el-tag type="danger" v-else>禁用</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-link type="primary" @click="editUser(scope.row)" icon="el-icon-edit">编辑</el-link>&nbsp;
            <el-link v-if="scope.row.status==0" type="warning" @click="changeStatus(scope.row)" >禁用
            </el-link>&nbsp;
            <el-link v-else type="success" @click="changeStatus(scope.row)" >启用
            </el-link>&nbsp;
            <el-link type="primary" @click="delUser(scope.row)">删除</el-link>
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
    <userDialog ref="userDialog"></userDialog>
  </div>
</template>
<script>
import {getUserDataApi,changeStatusApi,delUserApi} from '@/api/user.js'
import userDialog from './com/userDialog.vue'

export default {
  data() {
    return {
      form: {
        username: "",
        role_id:"",
        remark:"",
        page:1,//当前页
        pageSize:5,//页容量
      },
      total:20,//总数量
      tableData: [] //表格的数据
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //添加用户
    addUser(){
      this.$refs.userDialog.dialogFormVisible=true;
      this.$refs.userDialog.title="新增用户";
      this.$refs.userDialog.form={};
    },
    //编辑用户
    editUser(row){
      this.$refs.userDialog.dialogFormVisible=true;
      this.$refs.userDialog.title="编辑用户";
      this.$refs.userDialog.form=row;
    },
    //删除用户
    delUser(row){
      this.$confirm('你确定要删除该用户吗?').then(async()=>{
        let result=await delUserApi(row.u_id);
        if(result.data.code==200){
          this.$message.success({message:'删除成功'})
          if(this.tableData.length==1){
              this.form.page=1;//改变当前页
          }
          this.getUserList();
        }
      }).catch(()=>{
        console.log('取消');
      })
    },
    //改变用户状态
    async changeStatus(row){
        let result=await changeStatusApi({
          id:row.u_id,
          status:row.status
        })
        if(result.data.code==200){
            this.$message.success({message:'改变状态成功'})
            row.status=row.status==1?0:1
        }
    },
    //获取用户数据
    async getUserList(){
        let result=await getUserDataApi(this.form);
        if(result.data.code==200){
            this.tableData=result.data.data;
            this.total=result.data.total;
        }
    },
    //清除筛选
    clear(){
        this.form.username="",
        this.form.role_id=""
    },
    onSubmit() {
      console.log("submit!");
    },
    //页容量改变触发事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.form.pageSize=val;
      this.getUserList();
    },
    //当前页改变触发事件
    handleCurrentChange(val) {
      this.form.page=val;
      this.getUserList();
      console.log(`当前页: ${val}`);
    }
  },
  components:{
    userDialog
  }
};
</script>

<style lang="less">
.userlist {
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