<template>
  <footer class="footer">
    <div class="bx copyright">
       <a href="http://www.beian.miit.gov.cn/" target="_blank">粤ICP备20026074号-1 </a> <span class="line">|</span>
       Copyright © <a href="laijunfa.cn" >laijunfa.cn</a> <span class="line">|</span>
       <a href="https://github.com/laijunfa" title="github地址" target="_blank"><span class="iconfont icon-github"></span></a>
    </div>
  </footer>
</template>

<script>
export default {

}
</script>

<style lang="less">
@import url('https://at.alicdn.com/t/font_1777473_nfz0mxyf7lo.css');
.footer{
  height: 50px;
  color: #999;
  background-color: #333;
  font-size: 12px;
  .copyright{
    padding:10px 0;
    // text-align: center;
    a{
      color: #999;
    }
    .line{
      padding:0 10px;
    }
    img{
      height: 20px;
      width: 20px;
    }
    .icon-github{
      width: 30px;
      height: 30px;
    }
  }
}
</style>