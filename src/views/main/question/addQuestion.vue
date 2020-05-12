<template>
  <div class="question_dialog">
    <el-dialog  :fullscreen="true" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="questionForm" :rules="rules">
         <el-form-item label="试题类型" :label-width="formLabelWidth">
            <el-select v-model="form.subject" placeholder="请选择">
              <el-option label="前端" value="1"/>
              <el-option label="后端" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="题型" :label-width="formLabelWidth" prop="type">
            <el-radio-group v-model="form.type">
                <el-radio label="单选"></el-radio>
                <el-radio label="多选"></el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="难度" :label-width="formLabelWidth" prop="difficulty">
            <el-radio-group v-model="form.difficulty">
              <el-radio  label="简单"></el-radio>
              <el-radio  label="一般"></el-radio>
              <el-radio  label="困难"></el-radio>
            </el-radio-group>
            
          </el-form-item> -->
        <el-form-item prop="title" label="试题标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item> 
        <!-- 单选框 -->
        <el-form-item v-if="form.type=='单选'" label="单选" :label-width="formLabelWidth" prop="answer">
          <el-radio-group v-model="form.answer">
            <!-- <div class="option" v-for="(item, index) in labels" :key="index">
              <el-radio :label="item">{{item}}</el-radio><el-form-item :prop="'option'+item"><el-input v-model="form.optionA" ></el-input></el-form-item>
            </div> -->
            <div class="option">
              <el-radio label="A">A</el-radio><el-form-item prop="optionA"><el-input v-model="form.optionA" ></el-input></el-form-item>
            </div>
            <div class="option">
              <el-radio label="B">B</el-radio><el-form-item prop="optionB"><el-input v-model="form.optionB" ></el-input></el-form-item>
            </div>
            <div class="option">
              <el-radio label="C">C</el-radio><el-form-item prop="optionC"><el-input v-model="form.optionC" ></el-input></el-form-item>
            </div>
            <div class="option">
              <el-radio label="D">D</el-radio><el-form-item prop="optionD"><el-input v-model="form.optionD" ></el-input></el-form-item>
            </div>
          </el-radio-group>
        </el-form-item>
        <!-- 多选框 -->
        <el-form-item v-else-if="form.type=='多选'" label="多选" :label-width="formLabelWidth" prop="type">
            <el-checkbox-group v-model="form.multiple_select_answer">
              <div class="option">
              <el-checkbox label="A">A</el-checkbox><el-form-item prop="optionA"><el-input v-model="form.optionA" ></el-input></el-form-item>
            </div>
            <div class="option">
              <el-checkbox label="B">B</el-checkbox><el-form-item prop="optionB"><el-input v-model="form.optionB" ></el-input></el-form-item>
            </div>
            <div class="option">
              <el-checkbox label="C">C</el-checkbox><el-form-item prop="optionC"><el-input v-model="form.optionC" ></el-input></el-form-item>
            </div>
            <div class="option">
              <el-checkbox label="D">D</el-checkbox><el-form-item prop="optionD"><el-input v-model="form.optionD" ></el-input></el-form-item>
            </div>
            <div class="option">
              <el-checkbox label="E">E</el-checkbox><el-form-item prop="optionE"><el-input v-model="form.optionE" ></el-input></el-form-item>
            </div>
            </el-checkbox-group>
        </el-form-item>
        <!-- 答案解析 -->
        <el-form-item prop="answer_analyze" label="答案解析"  :label-width="formLabelWidth">
          <el-input type="textarea" rows="3" v-model="form.answer_analyze" placeholder="可不填" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="enter">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//addEnterPriseApi
import { addquestionApi, editquestionApi} from "@/api/question.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        subject:'',
        title:'',
        type:'单选',
        level:'简单',
        answer:'', //答案
        // single_select_answer:'',
        multiple_select_answer:[],
        answer_analyze:'',//答案解析
        options:{},//选项
      },
      rules: {
        subject: [{ required: true, message: "请输入学科", trigger: "blur" }],
        type: [{ required: true, message: "请输入题型", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        optionA: [{ required: true, message: "请输入选项A", trigger: "blur" }],
        optionB: [{ required: true, message: "请输入选项B", trigger: "blur" }],
        optionC: [{ required: true, message: "请输入选项C", trigger: "blur" }],
        optionD: [{ required: true, message: "请输入选项D", trigger: "blur" }],
        answer: [{ required: true, message: '请选择一个正确的答案', trigger: 'change' }],
      },
      formLabelWidth: "100px",
      title: "添加试题",
      //多选框的值
      checkList:[]
    };
  },
  methods: {
    changesub(val){
        this.form.subject=val;
    },
    clearForm() {
      this.$nextTick(() => {
        this.$refs.questionForm.resetFields();
      });
    },
    //确认
    enter() {
      this.$refs.questionForm.validate(valid => {
        //表单验证成功
        if (valid) {
          // title, answer, answer_analyze, subject, type, level 
          if (this.title == "添加试题") {
            let {optionA,optionB,optionC,optionD, optionE}=this.form;
            this.form.options=[
              {text:optionA,label:'A'},
              {text:optionB,label:'B'},
              {text:optionC,label:'C'},
              {text:optionD,label:'D'},
              {text:optionE,label:'E'}
            ]
            this.addUser();
          } else if (this.title == "编辑试题") {
            this.updateUser();
          }
        }
      });
    },
    //新增
    addUser() {
      //验证成功
      addquestionApi(this.form).then(result => {
        if (result.data.code == 200) {
          this.$message.success({ message: "添加成功" });
          //清空表单
          this.$refs.questionForm.resetFields();
          //刷新列表
          // this.$parent.getUserList();
        } else {
          this.$message.error({ message: "添加失败" });
        }
        console.log(result);
      });
      this.dialogFormVisible = false;
    },
   
  }
};
</script>

<style lang="less" scope>
.question_dialog {
  .el-dialog__header {
    text-align: center;
    background: linear-gradient(
      225deg,
      rgba(20, 147, 250, 1),
      rgba(1, 198, 250, 1)
    );
    .el-dialog__title {
      color: #fff;
    }
  }
  .el-dialog__body{
    padding: 20px 20px 0 20px;
  }
  .dialog-footer {
    text-align: center;
  }
  .el-dialog {
    width: 700px;
    .el-form{
      // width: 900px;
      margin: 0 auto;
      .option{
        display: flex;
        padding:10px 0;
      }
      .option:first-child{
        padding:0 0 10px 0;
      }
      .el-input__inner{
        width: 365px;
      }
      .el-radio{
        margin-top: 10px;
        margin-right: 10px;
      }
      .el-checkbox:last-of-type {
        margin-right: 10px;
      }
      .el-radio__label,.el-checkbox__label{
        .el-input__inner{
          margin-left: 10px;
        }
      }
    }
  }
}
</style>