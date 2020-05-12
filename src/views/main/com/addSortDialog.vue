<template>
  <div class="addSort">
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="sortName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSort">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addArticleSortApi} from '@/api/article'
export default {
  data() {
    return {
      dialogFormVisible:false,
      formLabelWidth:'100px',
      sortName:''
    }
  },
  methods: {
    addSort(){
      addArticleSortApi(this.sortName).then(result=>{
        if(result.data.code==200){
          this.$message.success('新增分类成功');
          this.dialogFormVisible=false;
          //触发实例上的绑定事件
          this.$emit('refresh')
        }else{
          this.$message.success('新增分类失败');
        }
      })
    }
  },
};
</script>

<style>
</style>