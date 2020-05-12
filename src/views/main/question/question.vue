<template>
  <div class="question">
    <el-card>
      题库
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="计算机" name="first">
          <!-- 面试宝典 -->
          <ul class="question_type">
            <li v-for="(item, index) in questionGroup" :key="index" :class="{'active':curIndex==index}" @click="liClick(index,item)">
              <img :src="list[index].imgUrl" alt="">
              <div >
                  <p>{{item.name}}测验</p>
                  <p>共{{item.count}}题</p>
              </div>
            </li>
          </ul>
          <div class="radio_group" v-if="curIndex!=-1">
            选择题目数量
            <el-radio-group v-model="radio">
              <el-radio :label="5">5题</el-radio>
              <el-radio :label="10">10题</el-radio>
              <el-radio :label="20">20题</el-radio>
            </el-radio-group>
            <div><el-button type="primary" plain @click="startTest">开始测试</el-button></div>
            <div><el-button type="primary" plain @click="openQuestionDialog">+添加试题</el-button></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="驾照" name="second">驾照</el-tab-pane>
      </el-tabs>
    </el-card>
    <addQuestion ref="addQuestion"></addQuestion>
  </div>
</template>

<script>
import addQuestion from './addQuestion.vue'
import {questionCountApi} from '@/api/question.js'
export default {
  data() {
    return {
      activeName: "first",
      curIndex:-1,
      radio:5,
      list:[
        {
          imgUrl:'https://uploadfiles.nowcoder.com/images/20190422/392538858_1555913371670_D984D7FA073FCE160D13EB9BAB591F8E',
          subject:'前端',
          count:100
        },
        {
          imgUrl:'https://uploadfiles.nowcoder.com/images/20190422/392538858_1555913371670_D984D7FA073FCE160D13EB9BAB591F8E',
          subject:'Java',
          count:50
        },
        {
          imgUrl:'https://uploadfiles.nowcoder.com/images/20190422/392538858_1555913364515_1DFB6E348B5F86DDF063259779AECF89',
          subject:'C++',
          count:35
        }
      ],
      questionGroup:[],
      subjectId:''
    };
  },
  components:{
    addQuestion
  },
  created() {
    this.questionCount();
  },
  methods: {
    async questionCount(){
      let result=await questionCountApi();
      this.questionGroup=result.data.data;
      this.questionGroup.push({name:'C++',count:0})
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    liClick(index,item){
      this.curIndex=index;
      this.subjectId=item.id;
    },
    startTest(){
      this.$router.push({
        name:'examination',
        params:{
          count:this.radio,
          subjectId:this.subjectId
        }
      });
    },
    openQuestionDialog(){
      this.$refs.addQuestion.dialogFormVisible=true;
      // this.open3();
    },
    open3() {
      this.$notify.info({
        title: '消息',
        message: '这是一条消息的提示消息',
        duration:0,
      });
   },
  }
};
</script>

<style lang="less" scoped>
.question {
  width: 80%;
  margin: 10px auto;
  height: 700px;
  .el-card {
    height: 100%;
  }
  ul.question_type {
    margin-top: 20px;
    height: 110px;
    li {
      float: left;
      width: 220px;
      height: 100px;
      margin-right: 10px;
      border: 1px solid #e1e1e1;
      border-radius: 4px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        margin:0 10px ;
      }
      div{
        p{
          font-size: 13px;
        }
      }
    }
    li.active{
        border:1px solid #409EFF;
    }
    li:hover {
      box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }
  .radio_group{
    margin-top: 30px;
    .el-radio-group{
      margin-left: 10px;
    }
    .el-button{
      margin-top: 20px;
    }
  }
}
</style>