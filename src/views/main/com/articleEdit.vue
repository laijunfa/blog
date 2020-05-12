<template>
  <div class="articleEdit">
    <el-dialog :title="isEdit?'编辑文章':'新增文章'" :visible.sync="dialogVisible" fullscreen width="30%" center>
      <el-input v-model="articleDetail.title" placeholder="标题"></el-input>
      <!-- 展示的图片 -->
      <!-- action="http://localhost:6060/api/upload/article" -->
      <el-upload
        class="upload-demo"
        action="http://106.14.155.113:6060/api/upload/article"
        name="image"
        :on-preview="handlePreview"
        :on-success="uploadSuccess"
        :on-remove="handleRemove"
        :file-list="fileList"
        list-type="picture">
        <el-button size="small" type="primary">上传文章预览图</el-button>
      </el-upload>
      <el-select v-model="articleDetail.sort_id" placeholder="请选择文章分类" @change="changeSort">
        <el-option
          v-for="item in artSorts"
          :key="item.id"
          :label="item.name"
          :ishljs="true"
          :value="item.id">
        </el-option>
      </el-select>
      <!-- markdown编辑器 highlight-->
      <mavon-editor
        v-model="articleDetail.content"
        ref="md"
        @change="change"
        @imgAdd="$imgAdd"
        @imgDel="$imgDel"
        style="min-height: 600px"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { editArticleApi,uploadApi,addArticleApi,getArticleSortApi } from "@/api/article";

// 导入组件 及 组件样式
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  data() {
    return {
      artSorts:[],
      dialogVisible: false,
      isEdit:true,
      articleDetail:{},
      isInterview:0,
      html: "", // 及时转的html
      fileList: [],//文件集合
      previewUrl:''
    };
  },
  // 注册
  components: {
    mavonEditor
  },
  created() {
    this.getArticleSort();
  },
  watch:{
    'articleDetail'(newVal,oldVal){
      // 空值设为空对象,说明是新增
      if(!newVal){
        this.articleDetail={title:'',content:''};
        this.isEdit=false;
      }
    }
  },
  methods: {
    changeSort(value){
      let type=this.artSorts.find((item,index)=>{
        return item.id==value;
      })
    },  
    // 删除预览图
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
    },
    //预览图片上传成功
    uploadSuccess(res){
      this.previewUrl=res.imgUrl;
    },
    async getArticleSort(){
      let result=await getArticleSortApi();
      this.artSorts=result.data.data;
    },
    $imgAdd(pos, $file){
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append('image', $file);
      uploadApi(formdata).then(result=>{
        if(result.data.code==200){
          let url='http://'+result.data.imgUrl.replace('\\','\/');
          url = url.replace("\\", "\/");
          this.$refs.md.$img2Url(pos, url);
        }
      })
    },
    $imgDel(){
      console.log('删除');
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },
    //确认修改
    submit() {
      
      // 参数
      if(this.isEdit){
        this.articleDetail.html=this.html;
        if(this.previewUrl){
          this.articleDetail.imgUrl=this.previewUrl;
        }
        // 请求
        editArticleApi(this.articleDetail).then(result => {
          if (result.data.code == 200) {
            this.$message.success("编辑成功");
            this.dialogVisible = false;
            // 触发实例上的事件
            this.$emit('refresh');
          } else {
            this.$message.error("编辑失败");
          }
        });
      }else{
        //新增
        this.addArticle();
      }
    },
    //新增文章
    addArticle(){
      // let {u_id,title,content,sort_id,interview_id}=request.body;
      let obj={
        u_id:'1',
        title:this.articleDetail.title,
        content:this.articleDetail.content,
        html:this.html,
        sort_id:this.articleDetail.sort_id,
        isInterview:this.isInterview,
        imgUrl:this.previewUrl
      }
      // if(!this.previewUrl){
      //   console.log('没有添加图片');
      // }
      //新增文章
      addArticleApi(obj).then(result=>{
        if(result.data.code==200){
            this.$message.success('添加文章成功')
            this.dialogVisible=false;
            //重新获取数据
            this.$emit('refresh');
        }else{
          this.$message.error('添加失败')
        }
      })
    },
  }
};
</script>
<style lang="less">
.articleEdit {
  .el-input{
    margin: 10px 0;
  }
}
</style>
<style lang="less">
.articleEdit{
  .upload-demo{
    width: 300px;
  }
  .el-dialog--center .el-dialog__body{
    padding: 25px 60px 30px;
  }
}
</style>