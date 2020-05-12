<template>
  <div class="question_result">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane name="first">
          <span slot="label">
            <i class="el-icon-s-data"></i> 评估报告
          </span>
          <div class="assess">
              <div class="score">
                <i class="el-icon-medal"></i> 
                得分:{{score}} 
                <span v-if="score<50"> 加油!奥利给</span>
                <span v-else-if="score<90"> 很优秀了</span>
                <span v-else> 恭喜你:打败了本站99.9％的人</span>
              </div>
              <div>试题类型:web前端开发</div>
              <div>正确题数:{{correctList.length}}/{{questionList.length}}</div>
              <div>用时: 00:11:20</div>
              <el-button type="primary" @click="activeName='two'">答案解析</el-button>
          </div>
        </el-tab-pane >
        <el-tab-pane name="two">
          <span slot="label">
            <i class="el-icon-document-checked"></i> 答案解析
          </span>
          <div class="result_wrap">
            <div class="tabs">
              <div>每题得分</div>
              <ul>
                <li v-for="(item, index) in questionList" :key="index" :class="{'active':index==curIndex}"  @click="switchTar(index)">
                  <a :class="{'error':item.answer!==item.radio}"  href="javascript:;">{{index+1}}</a>
                </li>
              </ul>
            </div>
            <div class="que_title">{{curIndex+1}}.{{curqt.title}}</div>
            <div class="que_answer"> 
              <span>正确答案 : {{curqt.answer}}</span> 
              你的答案 : <span v-if="curqt.answer==curqt.radio" style="color:#1abc9c" >{{ curqt.radio?curqt.radio:'空'}}</span>
                        <span v-else style="color:red" >{{ curqt.radio?curqt.radio:'空' }} (错误)</span>
           </div>
            <!-- 选项 -->
            <div class="question_item">
                <div class="options">
                 <div class="option_item" v-for="(item, index) in curqt.options" :key="index" :class="{'correct_answer':curqt.answer===item.label}">
                   {{item.label}}:{{item.text}}
                  </div>
                </div>
            </div>
            <!-- 答案解析 -->
            <div class="answer_analyze">
              答案解析:
              <div>{{curqt.answer_analyze}}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:true,
      activeName: "first",
      curIndex: 0,
      questionList:[],
      errorQuestions:[],
      correctList:[],
      curqt:{} ,//当前试题
    };
  },
  created() {
    this.questionList=this.$route.params.questionList;
    this.curqt=this.questionList[0];
    this.check();
  },
  methods: {
    
    check(){
       //错题
      this.errorQuestions=[]
      //对题
      this.correctList=[]
      //验证测试
      for (let i = 0; i < this.questionList.length; i++) {
        const question = this.questionList[i];
        //判断选择的答案是否等于正确答案
        if(question.radio!=question.answer){
          //添加到错题集合
          this.errorQuestions.push(question)
        }else{
          this.correctList.push(question)
        }
      }
      // 分数
      this.score=this.correctList.length/this.questionList.length*100;
    },
    // 切换选项
    switchTar(index){
      this.curqt=this.questionList[index];
      this.curIndex=index;
      console.log('当前试题',this.curqt);
    }
  },
};
</script>

<style lang="less" >
.question_result {
  width: 70%;
  margin: 10px auto;
  
  .el-card {
    height: 100%;
  }
  .assess{
    >div{
      color: #34495e;
      font-weight: 600;
      font-size: 17px;
      margin: 20px 0 20px 10px;
    }
    .score{
      .el-icon-medal{
        font-size: 25px;
        color: red;
      }
    }
  }
  .result_wrap{
    padding: 10px;
    height: 700px;
    // background-color: #f9f9f9;
    .tabs{
       padding: 10px 0;
       border-bottom: 1px solid #ededed;
      ul{
        margin: 10px 0;
        height: 50px;
        li{
          width: 32px;
          height: 32px;
          line-height: 32px;
          
          float: left;
          margin-right: 10px;
          color: #fff;
          text-align: center;
          cursor: pointer;
          a{
            display: inline-block;
            width: 100%;
            height: 100%;
            background-color: #1abc9c;
          }
          .error{
            background-color:red;
          }

        }
        .active{
          transform: scaleY(1.3);
        }
     } 
    }
    .que_title{
      height: 80px;
      line-height: 80px;
      border-bottom: 1px solid #ededed;
    }
    .que_answer{
      margin-top: 20px;
    }
  }
  .question_item{
    
    .options{
      .option_item{
        margin-top: 20px;
        border-radius: 6px;
        border: 1px solid #d4d4d4;
        padding: 10px;
        background: #fff;
      }
      .correct_answer{
        border: 1px solid #1abc9c;
      }
    }
  }
  .answer_analyze{
    margin-top: 20px;
  }
}
</style>