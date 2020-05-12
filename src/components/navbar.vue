<template>
   <nav id="top_nav">
      <div class="bx">
        <el-menu active-text-color="#00a8ff" text-color="black" router :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="home" >首页</el-menu-item>
          <el-menu-item index="handbook" >前端开发</el-menu-item>
          <el-menu-item index="question" >技能测验</el-menu-item>
          <el-submenu index="yule">
            <template slot="title">云</template>
            <el-menu-item index="player">音乐</el-menu-item>
            <el-menu-item index="2-1">游戏</el-menu-item>
            <el-menu-item index="TweakCube">魔方</el-menu-item>
        </el-submenu>
          <el-menu-item index="message" >留言板</el-menu-item>
        </el-menu>
      </div>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            activeIndex:'home'
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            this.activeIndex=key;
        }
    },
    created() {
        this.handleSelect();
    },
}
</script>

<style lang="less" >
// 头部导航
#top_nav{
    height: 65px;
    width: 100%;
    background-color: white;
    box-shadow:0 0 4px 0 black;
    ul{
        display: flex;
        align-items: center;
        height: 65px;
        li{
            list-style: none;
            float: left;
            width: 100px;
            line-height: 65px;
            text-align: center;
            a{
                color: #000;
                text-decoration: none;
            }
            a:hover{
                color: #eb5055;
            }
        }
    }
    
    .el-menu-demo .el-menu-item{
        border:0;
        font-size: 14px;
    }
    .el-menu.el-menu--horizontal{
        border: 0;
    }
    .el-submenu .el-submenu__title{
        border: 0;
        height: 57px;
        line-height: 60px;
    }
}
</style>