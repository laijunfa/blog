<template>
  <div class="admin_index">
    <el-container>
      <el-header>
        <div class="hd_left">
          <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" title="收缩" @click="isCollapse=!isCollapse"></i>
          <!-- <i class="el-icon-s-unfold" title="展开"></i> -->
          <h1>博客后台管理系统</h1>
        </div>
        <div class="hd_right">
          <!-- <i class="el-icon-bell"></i> -->
          <el-avatar class="avatar"><img :src="$store.state.userInfo.u_avatar" alt=""></el-avatar>
          <span class="username">欢迎你,{{$store.state.userInfo.u_nickname}}</span>
          <el-button type="primary" size="mini" @click="logout">退出系统</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="auto">
          <el-menu :router="true" :default-active="$route.path" class="el-menu-vertical-demo" background-color="#324157" text-color="#fff" :collapse="isCollapse">
            <el-menu-item index="/admin/home">
              <i class="el-icon-menu"></i>
              <span slot="title">系统首页</span>
            </el-menu-item>
            <el-menu-item index="/admin/chart">
              <i class="el-icon-s-data"></i>
              <span slot="title">统计分析</span>
            </el-menu-item>
            <el-menu-item index="/admin/article">
              <i class="el-icon-document-copy"></i>
              <span slot="title">文章管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/user">
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/message">
              <i class="el-icon-chat-dot-square"></i>
              <span slot="title">留言管理</span>
            </el-menu-item>
            <el-menu-item>
              <i class="el-icon-eleme"></i>
              <span slot="title">题库管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import local from '@/utils/localStorage'
export default {
  data() {
    return {
      isCollapse:false
    }
  },
  methods: {
    logout(){
      window.localStorage.removeItem('userInfo');
      this.$store.commit('setUserInfo',{})
      this.$router.push('/login')
    }
  },
};
</script>

<style lang="less">
.admin_index {
  height: 100%;
  .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #242f42;
    color: #fff;
    line-height: 70px;
    height: 70px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .hd_left {
      display: flex;
      align-items: center;
      h1 {
        margin-left: 20px;
        font-size: 22px;
        font-weight: normal;
      }
    }
    .hd_right {
      display: flex;
      align-items: center;
      .avatar {
        margin: 0 5px 0 20px;
      }
      .username {
        margin: 0 20px 0 0;
      }
    }
  }
  .el-aside {
    .el-menu{
      height: 100%;
    }
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
  }
  .el-icon-s-unfold,
  .el-icon-s-fold,
  .el-icon-bell {
    font-size: 22px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  }
  .el-menu-vertical-demo{
    height: 100%;
  }
}
</style>