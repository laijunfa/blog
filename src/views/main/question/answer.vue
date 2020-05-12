<template>
  <div class="question_assess">
      <el-tabs v-model="activeName" @tab-click="handleClick"></el-tabs>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-s-data"></i> 答案解析
          </span>
        
        </el-tab-pane>
        <el-tab-pane label="答案解析2">答案解析2</el-tab-pane>
      </el-tabs>
    <addQuestion ref="addQuestion"></addQuestion>
  </div>
</template>

<script>
import addQuestion from "./addQuestion.vue";
export default {
  data() {
    return {
      activeName: "first",
      curIndex: -1,
      radio: 5
    };
  }
};
</script>

<style lang="less" scoped>
.question_assess {
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
        margin: 0 10px;
      }
      div {
        p {
          font-size: 13px;
        }
      }
    }
    li.active {
      border: 1px solid #409eff;
    }
    li:hover {
      box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }
  .assess{
    div{
      font-weight: 600;
      font-size: 17px;
      margin: 20px 0 20px 10px;
    }
  }
}
</style>