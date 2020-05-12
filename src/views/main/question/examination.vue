<template>
  <div class="examination">
    <el-card>
      <div>
        <h3 class="title">编程语言--javascript专项练习</h3>
         <!-- 答题卡 -->
        <div class="answer_card">
          <div class="question_type">
            <span>答题卡 ( 共10题 )</span>
            <span><i class="el-icon-video-pause"></i> 00:00:10</span>
          </div>
          <!-- 选项卡 -->
          <ul>
            <!-- 如果radio有值,则添加样式 -->
            <li v-for="(item, index) in questionList" :class="{'active':item.radio}" @click="switchTar(index)" :key="index">{{index+1}}</li>
          </ul>
        </div>
        <!-- 题目 -->
        <div class="question" >
            <h3 class="ques_title"><i>{{curIndex+1}}</i>{{curqt.title}}</h3>
            <div style="margin-top: 20px">
              <!-- 选项  渲染时,绑定当前试题radio-->
              <el-radio v-for="(item, index2) in curqt.options" :key="index2" v-model="curqt.radio" :label="item.label" border size="medium">{{item.text}}</el-radio>
            </div>
        </div>
        <div class="submit">
          <el-button @click="submit" type="primary" plain icon="el-icon-check">提交测试</el-button>
          <p>交卷即可查看全部答案和解析</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {queryQuestionApi} from '@/api/question'
export default {
  data() {
    return {
      curIndex: 0,
      questionList:[],
      curqt:{} ,//当前试题
    };
  },
  created() {
    this.getQuestion();
    //获取试题数量
    // this.questionCount=this.$route.query.count;
  },
  methods: {
    // 切换选项
    switchTar(index){
      this.curqt=this.questionList[index];
      this.curIndex=index;
      console.log('当前试题',this.curqt);
    },
    // 获取试题
    async getQuestion(){
      let {count,subjectId}=this.$route.params;
      console.log(count,subjectId);
      
      let result=await queryQuestionApi({count,subjectId});
      console.log(result);
      
      if(result.data.code==200){
        this.questionList=result.data.data;
        console.log(result.data.data);
        this.curqt=result.data.data[0];
      }
    },
    // 结算
    async openFullScreen() {
      const loading = this.$loading({
        lock: true,
        text: '结算中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await setTimeout(() => {
        loading.close();
        // 跳转到结果页面
        this.$router.push({
          name:'assess',
          params:{
            questionList:this.questionList
          }
        })
      }, 1000);
    },
    //提交测试
    async submit(){
      let flag=false;
      //先判断是否填写完整
      this.questionList.forEach((item,index)=>{
        if(!item.radio){
         this.$confirm('你还有题没答完,确定提交测试吗?').then(result=>{
            this.openFullScreen();
          }).catch(()=>{
           
          })
        }else{
          //
          if(this.questionList.length-1==index){
            this.openFullScreen();
          }
        }
      })
     
    }
  }
};
</script>
<style lang="less">
.examination {
  width: 70%;
  margin: 10px auto;
  position: relative;
  // height: 700px;
  .el-card{
    height: 100%;
    overflow:visible;
  }
  h3.title{
    line-height: 50px;
    border-bottom: 1px solid #eee;
  }
  h3.ques_title{
    margin-top: 20px;
    line-height: 25px;
    border: 0;
    i{
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 10px;
      line-height: 20px;
      text-align: center;
      color: #fff;
      font-size: 15px;
      background-color: #5d9cec;
      border-radius: 50%;
    }
  }
  .question{
    width: 700px;
  }
  .el-radio--medium{
    width: 100%;
    display: block;
    margin-top: 10px;
    height: 44px;
    line-height: 22px;
  }
  .el-radio.is-bordered+.el-radio.is-bordered{
    margin:15px 0px !important;
  }
  // 答题卡
  .answer_card{
    border: 1px solid #dcdfe6;
    margin-top: 10px;
    .el-icon-video-pause{
      color: red;
      font-size: 18px;
    }
    .question_type{
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      span{
        margin-right: 20px;
      }
    }
    ul{
      padding: 10px;
      overflow: hidden;
      li{
        float: left;
        width: 35px;
        height: 35px;
        line-height: 35px;
        margin:0 10px 10px 0;
        text-align: center;
        border: 1px solid #dcdfe6;
        cursor: pointer;
      }
      li:hover{
        background-color: #ecf5ff;
      }
      .active{
        background-color: skyblue;
        color: #fff;
      }
    }
  }
  // 提交
  .submit{
    // bottom: 3px;
    // right: 10px;
    width: 600px;
    margin-top: 30px;
    .el-button{
      position: relative;
      left: 600px;
    }
  }
  
}
</style>