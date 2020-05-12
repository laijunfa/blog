<template>
  <div class="examination">
    <el-card>
      <div>
        <h3 class="title">编程语言--javascript专项练习</h3>
        <!-- 题目 -->
        <div class="question" :id="'que'+(index+1)" v-for="(question, index) in questionList" :key="index">
            <h3 class="ques_title"><i>{{index+1}}</i>{{question.title}}</h3>
            <div style="margin-top: 20px">
              <!-- 选项  渲染时,绑定当前试题radio-->
              <el-radio @change="changeOption" v-for="(item, index2) in question.options" :key="index2" v-model="question.radio" :label="item.label" border size="medium">{{item.text}}</el-radio>
            </div>
        </div>
      </div>
      <!-- 答题卡 -->
      <div class="answer_card">
        <div class="top">
          <span style="background:#25bb9b">答题卡</span>
          <span><i class="el-icon-video-pause"></i> 00:00:10</span>
        </div>
        <div class="question_type">
          <span>单选题 ( 共10题 )</span>
        </div>
        <!-- 选项卡 -->
        <ul>
          <!-- <li v-for="(item, index) in questionList" :class="{'active':item.radio}" :key="index"><a :href="'#que'+(index+1)">{{index+1}}</a></li> -->
          <!-- 如果radio有值,则添加样式 -->
          <li v-for="(item, index) in questionList" :class="{'active':item.radio}" @click="skip(index)" :key="index">{{index+1}}</li>
        </ul>
        <!-- 提交测试 -->
        <div class="submit">
          <el-button @click="submit" type="primary" plain icon="el-icon-check">提交测试</el-button>
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
      questionList:[],
    };
  },
  created() {
    this.getQuestion();
    //获取试题数量
    // this.questionCount=this.$route.query.count;
  },
  methods: {
    // 在当前页面跳转
    skip(index){
      index+=1
      // 跳转到指定id
      document.getElementById('que'+index).scrollIntoView();
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //选择 
    changeOption(val) {
     //当前试题label的值
      console.log(val);
    },
    getQuestion(){
      queryQuestionApi(this.$route.query.count).then(result=>{
        this.questionList=result.data.data;
      })
    },
    //提交测试
    async submit(){
      let flag=false;
      //先判断是否填写完整
      this.questionList.forEach((item,index)=>{
        if(!item.radio){
         this.$confirm('你还有题没答完,确定提交测试吗?').then(result=>{
            this.$router.push({
              name:'assess',
              params:{
                questionList:this.questionList
              }
            })
          }).catch(()=>{
           
          })
        }else{
          //
          if(this.questionList.length-1==index){
            this.$router.push({
                name:'assess',
                params:{
                  questionList:this.questionList
                }
            })
          }
        }
      })
     
    }
  }
};
</script>
<style lang="less">
.examination {
  width: 80%;
  margin: 10px auto;
  position: relative;
  // height: 700px;
  .el-card{
    height: 100%;
    overflow:visible;
    .el-card__body{
      display: flex;
      justify-content: space-around;
    }
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
    width: 600px;
  }
  .el-radio--medium{
    display: block;
    width: 500px;
    margin-top: 10px;
  }
  .el-radio.is-bordered+.el-radio.is-bordered{
    margin:10px 0px !important;
  }
  // 答题卡
  .answer_card{
    position: sticky;
    top: 70px;
    margin-top: 50px;
    width: 300px;
    height: 400px;
    border: 1px solid #ccc;
    .el-icon-video-pause{
      color: red;
      font-size: 18px;
    }
    .top{
      height: 45px;
      line-height: 45px;
      display: flex;
      span{
        text-align: center;
        flex: 1;
      }
    }
    .question_type{
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
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
        border: 1px solid #ccc;
        cursor: pointer;
      }
      .active{
        background-color: skyblue;
        color: #fff;
      }
    }
    // 提交
    .submit{
      position: absolute;
      bottom: 3px;
      right: 10px;
    }
  }
  
}
</style>