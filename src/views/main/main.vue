<template>
  <div>
    <!-- 导航 -->
    <navbar></navbar>
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <!-- 尾部 -->
    <footerCpn></footerCpn>
    <el-backtop :bottom="100"></el-backtop>
  </div>
</template>

<script>
import navbar from "../../components/navbar";
import footerCpn from '@/components/footer'
export default {
  components: {
    navbar,
    footerCpn
  }
};
</script>

<style>
/* 进入过度的开始状态 */
.fade-enter {
  opacity: 0;
}
/* 离开过度的开始状态 */
.fade-leave {
  opacity: 1;
}
/* 进入过度的结束状态 */
.fade-enter-active {
  transition: opacity 0.5s;
}
/* 离开过度的结束状态 */
.fade-leave-active {
  opacity: 0;
  transition: opacity 0.5s;
}
</style>