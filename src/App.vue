<template>
  <div class="app">
    <!-- 路由出口 -->
    <router-view></router-view>
    <div class="play_bottom" :class="{'player-show':isShow}">
      <Aplayer ref="aplayer" v-if="musicList.length>0"
        repeat="list"
        theme='#fff'
        :listFolded="true"
        :showLrc="true" 
        :music="musicList[0]" 
        :list="musicList" />
    </div>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'
import axios from 'axios'
export default {
  data() {
    return {
      musicList: [],
      isShow:true
    }
  },
  components: {
    Aplayer
  },
  created() {
    this.getMusicList();
    setTimeout(()=>{
      this.isShow=false
    },2000)
  },
  methods: {
    //获取网易云歌单
    async getMusicList() {
      let result = await axios({
        method: "get",
        url: "https://api.imjad.cn/cloudmusic/?type=playlist&id=4950690744" //获取我的歌单
      });
      let musics = result.data.playlist.tracks; //歌曲信息列表
      musics.forEach((item, index) => {
        axios({
          //根据歌曲id获取播放地址
          url: `https://api.imjad.cn/cloudmusic/?type=song&id=${item.id}&br=128000`
        }).then(result => {
          result.data.data.forEach(async (item2, index) => {
            let lyricObj=await axios({
                // 歌曲id获取歌词
                url: `https://api.imjad.cn/cloudmusic/?type=lyric&id=${item.id}`,
            });
            let music = {
              title: item.name, //歌曲名
              artist: item.ar[0].name, //歌手
              src: item2.url, //歌曲播放地址
              pic: item.al.picUrl, //专辑图片
              lrc: lyricObj.data.lrc.lyric, //歌词
            };
            this.musicList.push(music);
          });
        });
      });
    },
  },
}
</script>

<style>
@import url("./style/main/base.css");
/* 全局路由动画 */
.page-enter-active,
.page-leave-active {
  transition: all .3s;
  opacity: 1;
}

.page-enter,
.page-leave-active {
  transform: translate3d(50%, 0, 0);
  opacity: 0;
}
.play_bottom{
  position: fixed;
  z-index: 10;
  width: 100%;
  bottom: -80px;
  background-color: #fff;
  opacity: 0;
  transition: all 1.5s;
}
.aplayer-body .aplayer-info{
  /* background-color: #ccc; */
}
.play_bottom .aplayer{
  width:1200px;
  margin: 0 auto;
}
.play_bottom:hover{
  bottom: 0px;
  opacity: 1;
}
.player-show{
  bottom: 0px;
  opacity: 1;
}
</style>