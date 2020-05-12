<template>
  <div class="music">
    <div class="player">
      <!-- 歌曲列表工具栏 -->
      <div class="song_toolbar">
        <span>收藏</span>
        <span>添加到</span>
        <span>下载</span>
        <span>删除</span>
      </div>
      <div class="player_bd">
        <!-- 音乐列表 -->
        <ul class="song_list" @mouseout="curIndex=-1">
          <li class="list_item">
            <span class="item_num"></span>
            <span class="song_name">歌曲</span>
            <span class="song_singer">歌手</span>
            <span class="song_time">时长</span>
          </li>
          <!-- <li class="list_item">
              <span class="item_num">1</span>
              <span class="song_name">世界那么大还是遇见你</span>
              <span class="song_singer">程响</span>
              <span class="song_time">04:10</span>
          </li>-->
          <!-- 鼠标经过显示当前列表显示操作菜单 -->
          <li
            class="list_item"
            @mouseover="curIndex=index"
            v-for="(song, index) in songs"
            :key="index"
          >
            <!-- 当前播发的音乐id==列表项的id时添加背景样式 -->
            <span
              class="item_num"
              :class="{'item_num_bg':curSongId==song.id}"
            >{{curSongId==song.id?'':index+1}}</span>
            <span class="song_name">
              <span>{{song.name}}</span>
              <!-- 图标菜单集合 -->
              <!-- 如果当前经过的下标==列表下标则显示 -->
              <div class="icon_menu_list" v-show="curIndex==index">
                <!-- 点击播放音乐将列表项的音乐id赋给当前播发的id -->
                <span
                  :class="curSongId==song.id?'icon-pause':'icon-play'"
                  @click="changeMusicStatus(song),curSongId=song.id"
                  title="点击播放歌曲"
                ></span>
                <span class="icon-add" title="添加到歌单"></span>
                <!-- <span class="icon-download"  title="下载歌曲"></span> -->
                <span class="icon-delete" title="在列表中删除"></span>
              </div>
            </span>
            <span class="song_singer">{{song.artists | filterSinger}}</span>
            <span class="song_time">{{song.duration | filterTime}}</span>
          </li>
        </ul>

        <!-- 音乐详情 -->
        <div class="song_info">
          <!-- 专辑图片 -->
          <div class="song_album">
            <img
              src="https://y.gtimg.cn/music/photo_new/T002R300x300M000004caeLs0DnfjN.jpg?max_age=2592000"
              alt
            />
          </div>
          <p class="song_info_name">歌曲名:神话</p>
          <p class="song_info_singer">歌手名:成龙/金善喜</p>
          <p class="song_album_name">专辑名:你好s</p>
          <!-- 歌词 -->
          <div class="song_lyric">
            123
            <br />456
            <br />
          </div>
        </div>
      </div>
      <div class="player_fd">
        <!-- canplay播放时间,timeupdate监听当前播发时间 -->
        <audio @canplay="getDuration" @timeupdate="timeupdate" @play="playEvent" @pause="pauseEvent" controls :src="musicUrl" ref="audio"></audio>
        <div class="player_music">
          <a href class="prev_btn" title="上一首"></a>
          <a
            href="javascript:;"
            :class="curSongId==-1?'play_btn':'pause_btn'"
            @click="playOrpause"
            title="播放"
          ></a>
          <a href class="next_btn" title="下一首"></a>
          <div class="player_music_info">
            <div class="info_top">
              <span>{{songInfo.name}} - {{songInfo.singer}}</span>
              <span>00:06 / {{songInfo.time}}</span>
            </div>
            <div class="info_bottom">
              <!--音乐进度条  -->
              <div class="music_progress"></div>
              <!-- 小圆点 -->
              <div class="progress_dot"></div>
            </div>
          </div>
          <a href class="voice" title="静音"></a>
        </div>
      </div>
    </div>
    <!-- 背景 -->
    <div class="player_bg"></div>
    <!-- 遮罩 -->
    <div class="player_mask"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      songs: [], //歌曲列表
      searchValue: "神话",
      curIndex: -1, //当前下标,
      musicUrl: "", //音乐播放地址
      curSongId: -1, //当前播放的音乐id
      songInfo:{} //当前播放歌曲信息
    };
  },
  created() {
    this.searchSongs();
  },
  methods: {
    timeupdate(e){
      //  this.currentTime = e.target.currentTime;
      console.log(e.target.currentTime);
      
    },
    getDuration(){

    },
    //监听音乐开始播放事件
    playEvent() {
      let audio = this.$refs.audio;
      //将audio上的属性值赋给当前音乐id
      this.curSongId = audio.dataset.songid;
    },
    //监听音乐暂停事件
    pauseEvent() {
      this.curSongId = -1;
      // console.log('=>>>>>暂停...',this.curSongId);
    },
    //播放音乐
    playMusic(songId) {
      this.$nextTick(() => {
        let audio = this.$refs.audio;
        if(songId!=undefined){
          //设置属性和值
          audio.setAttribute('data-songid',songId)
          //将audio上的属性值赋给当前音乐id
          this.curSongId = audio.dataset.songid;
        }
        audio.play();
      });
      this.isShowBg = true;
    },
    //暂停音乐
    pauseMusic() {
      this.$nextTick(() => {
        let audio = this.$refs.audio;
        audio.pause();
      });
      // this.isShowBg = true;
    },
    //播放或暂停
    playOrpause(){
      //如果是暂停就播放,反之
      if(this.curSongId==-1){
          this.playMusic();
      }else{
          this.pauseMusic();
      }
    },
    //改变音乐状态
    changeMusicStatus(song) {
        console.log(song);
        this.songInfo.name=song.name;
        //使用过滤器
        this.songInfo.singer=this.$options.filters['filterSinger'](song.artists);
        this.songInfo.time=this.$options.filters['filterTime'](song.duration);
        
        //暂停当前项的播放
        if(this.curSongId==song.id) {
          //暂停音乐
          this.pauseMusic();
        }else{
           //根据音乐id获取播放地址
          this.getSongUrl(song.id).then(result => {
            console.log("音乐播放地址", result);
            this.musicUrl = result.data.data[0].url;
            //开始播放歌曲
            this.playMusic(song.id);
          });
        }
    },
    //获取音乐播放地址
    getSongUrl(songId) {
      return this.$axios({
        method: "post",
        url: "song/url",
        params: {
          id: songId,
          t: Date.now()
        }
      })
    },
    //1.搜索音乐
    searchSongs() {
      this.$axios({
        url: "/search",
        params: {
          keywords: this.searchValue
        }
      }).then(result => {
        this.songs = result.data.result.songs;
        console.log(result);
      });
    },
    //获取音乐详情
    getSongInfo(songId) {
      this.$axios({
        url: "song/detail",
        params: {
          ids: songId
        }
      }).then(result => {
        console.log(result);
      });
    },

    //获取云音乐热歌榜
    getMusicHot() {
      this.$axios({
        method: "get",
        url: "/top/list?idx=1"
      }).then(result => {
        console.log(result);
        //截取音乐列表20条
        // let songList = result.data.privileges.slice(0, 20);
        // songList.forEach(item => {
        //   // this.getSongInfo(item.id);
        // });
      });
    }
  },
  //过滤器
  filters: {
    filterSinger(singer) {
      let str = singer.map(item => {
        return item.name;
      });
      return str.join("/");
    },
    //过滤时间
    filterTime(time) {
      let minute = "0000" + Math.floor(time / 1000 / 60); //将毫秒转换为分钟
      let second = "0000" + Math.floor((time / 1000) % 60); //取分钟后剩下的余数
      // 切割字符 slice(-2) 表示取字符串后面两位
      return minute.slice(-2) + ":" + second.slice(-2);
    }
  }
};
</script>

<style>
@import url("../../style/main/player.css");
</style>