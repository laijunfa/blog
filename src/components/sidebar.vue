<template>
  <!-- 侧边栏 -->
  <div id="siderbar">
    <!-- 用户信息 -->
    <div class="userInfo">
      <img src="@/assets/img/index/qiyu.jpg" alt />
      <div class="username">任我行</div>
      <div>每个不曾起舞的日子,都是对生命的辜负</div>
      <div class="link_me">
        <a href="https://github.com/laijunfa" title="github地址" target="_blank">
          <span class="iconfont icon-github"></span>
        </a>
        <a href="javascript:;" title="">
          <span class="iconfont icon-tubiao209"></span>
        </a>
        <a href="javascript:;" title>
          <span class="iconfont icon-zhihu"></span>
        </a>
      </div>
    </div>
    <!-- 音乐播放器 -->
    <!-- <Aplayer v-if="musicList.length>0" :listFolded="true" :showLrc="true" :music="musicList[0]" :list="musicList" /> -->
    <!-- 标签列表 -->
    <div class="label_list">
      <h4>分类列表</h4>
      <div class="keywords">
        <span v-for="(item, index) in groupList" :key="index">{{item.name}} ({{item.count}})</span>
      </div>
    </div>
    <!-- 最新留言 -->
    <div class="message">
      <h3>最新留言</h3>
      <ul>
        <li v-for="(item, index) in messageList" :key="index">
          <span class="user" :title="item.u_id?item.u_nickname:item.visitor">
            <span v-if="item.u_avatar">
              <img :src="item.u_avatar" alt />
            </span>
            <!-- 没有头像的用户 -->
            <span v-else class="s_caller">
              <!-- 普通用户 -->
              <span v-if="item.u_id">{{item.u_nickname.substring(0,1)}}</span>
              <!-- 访客 -->
              <span v-else>{{item.visitor.substring(0,1)}}</span>
            </span>
            <span class="name">{{item.u_id?item.u_nickname:item.visitor}}</span>
          </span>
          <span class="msg">{{item.content}}</span>
          <span class="time">{{$moment(item.time).fromNow()}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Aplayer from "vue-aplayer"; // 音乐插件
import { getArticleGroupApi } from "@/api/article";
import { getMessageListApi } from "@/api/message";
import axios from "axios";
export default {
  data() {
    return {
      musicList: [],
      groupList: [],
      messageList: []
    };
  },
  components: {
    Aplayer
  },
  created() {
    this.getArticleGroup();
    this.getMessageList();
    // this.getMusicList();
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
              lrc: lyricObj.data.lrc.lyric //歌词
            };
            this.musicList.push(music);
          });
        });
      });
    },
    // 文章分组
    async getArticleGroup() {
      let result = await getArticleGroupApi();
      this.groupList = result.data.data;
    },
    // 留言列表
    async getMessageList() {
      let obj = {
        status: 1,
        page: 1, //当前页面
        pageSize: 10 //页面容量
      };
      let result = await getMessageListApi(obj);
      this.messageList = result.data.data;
    }
  }
};
</script>

<style lang="less">
@import url("https://at.alicdn.com/t/font_1777473_nfz0mxyf7lo.css");
//侧边栏
#siderbar {
//   height: 1200px;
  width: 320px;
  // background-color: #fff;
  .userInfo {
    // margin-top: 300px;
    text-align: center;
    padding-top: 50px;
    width: 100%;
    height: 350px;
    background-color: #fff;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    div {
      padding: 5px 0;
    }
    .link_me {
      width: 150px;
      margin: 20px auto;
      display: flex;
      justify-content: space-around;
      span {
        display: inline-block;
        width: 50%;
      }
      a > {
        padding: 10px;
        i {
          display: inline-block;
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  //音乐播放器
  .aplayer {
    padding: 10px;
    margin: 10px 0;
    .aplayer-body {
      height: 90px;
      .aplayer-pic {
        height: 100%;
        width: 90px;
      }
      .aplayer-info {
        height: 100%;
      }
    }
  }
  //标签列表
  .label_list {
    margin-top: 10px;
    width: 100%;
    height: 250px;
    background-color: #fff;
    padding: 10px;
    h4 {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
    }
    .keywords {
      // background-color: #ececec;
      display: flex;
      flex-wrap: wrap;
      span {
        color: #7d7d7d;
        // color: black;
        display: inline-block;
        padding: 5px 9px;
        margin: 5px;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.5s;
        position: relative;
        z-index: 1;
        // border: 1px solid rgba(0,0,0,0.1);
        transition: all 0.5s;
        position: relative;
        font-size: 13px;
      }
      span::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        border-radius: 2px;
        border: 1px solid #dfdfdf;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        -o-transition: all 0.3s;
        transition: all 0.3s;
      }
      span:hover::before {
        opacity: 0;
        -webkit-transform: scale(1.2, 1.2);
        transform: scale(1.2, 1.2);
      }
      span::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        opacity: 0;
        border-radius: 2px;
        background-color: rgba(117, 164, 250, 0.5);
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        -o-transition: all 0.3s;
        transition: all 0.3s;
        -webkit-transform: scale(0.5, 0.5);
        transform: scale(0.5, 0.5);
      }
      span:hover::after {
        opacity: 1;
        -webkit-transform: scale(1, 1);
        transform: scale(1, 1);
      }
    }
  }

  //最新留言
  .message {
    width: 100%;
    height: 350px;
    overflow: hidden;
    margin-top: 10px;
    padding: 10px;
    // border: 1px solid red;
    background: #fff;
    h3 {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
    }
    ul {
      li {
        width: 100%;
        height: 35px;
        line-height: 25px;
        font-size: 12px;
        overflow: hidden;
        span {
          float: left;
        }
        span.time {
          float: right;
        }
        span.user {
          width: 110px;
          cursor: pointer;
          img,
          .s_caller {
            display: inline-block;
            width: 24px;
            height: 24px;
            margin: 0 8px 0 10px;
            border-radius: 50%;
            background-color: skyblue;
          }
          .s_caller {
            span {
              width: 100%;
              text-align: center;
              color: #fff;
              line-height: 24px;
            }
          }
          .name {
            width: 50px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        span.msg {
          width: 120px;
          /*1. 先强制一行内显示文本*/
          white-space: nowrap;

          /*2. 超出的部分隐藏*/
          overflow: hidden;

          /*3. 文字用省略号替代超出的部分*/
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>