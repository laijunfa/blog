<template>
  <div class="user_dialog">
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="userForm" :rules="rules">
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="role_id" label="角色" :label-width="formLabelWidth">
           <el-select v-model="form.role_id" placeholder="请选择状态">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="角色" :label-width="formLabelWidth">
           <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="用户备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
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
import { adduserApi, edituserApi} from "@/api/user.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        username: "",
        email: "1882345@qq.com",
        phone: "18823452834",
        role_id: "",
        status: "",
        remark: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        role_id: [
          { required: true, message: "请输入选择角色", trigger: "blur" }
        ]
      },
      formLabelWidth: "100px",
      title: ""
    };
  },
  methods: {
    clearForm() {
      this.$nextTick(() => {
        this.$refs.userForm.resetFields();
      });
    },
    //确认
    enter() {
      this.$refs.userForm.validate(valid => {
        //表单验证成功
        if (valid) {
          if (this.title == "新增用户") {
            this.addUser();
          } else if (this.title == "编辑用户") {
            this.updateUser();
          }
        }
      });
    },
    //新增
    addUser() {
      //先验证表单
      //验证成功
      adduserApi(this.form).then(result => {
        if (result.data.code == 200) {
          this.$message.success({ message: "添加成功" });
          //清空表单
          this.$refs.userForm.resetFields();
          //刷新列表
          this.$parent.getUserList();
        } else {
          this.$message.error({ message: "添加失败" });
        }
        console.log(result);
      });
      this.dialogFormVisible = false;
    },
    //修改
    updateUser() {
      edituserApi(this.form).then(result => {
        if (result.data.code == 200) {
          console.log("this.form", this.form);

          this.$message.success({ message: "更新成功" });
          //刷新数据
          this.$parent.getUserList();
          this.$refs.userForm.resetFields();
          //关闭模态框
          this.dialogFormVisible = false;
        } else {
          this.$message.error({ message: "更新失败" });
        }
        console.log(result);
      });
    }
  }
};
</script>

<style lang="less" scope>
.user_dialog {
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
  .dialog-footer {
    text-align: center;
  }
  .el-dialog {
    width: 600px;
  }
}
</style>