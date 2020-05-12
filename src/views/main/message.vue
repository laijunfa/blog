<template>
    <div id="message">
        <div class="main">
            <!-- 留言板 -->
            <div class="message_board">
                <div class="notice">
                    <!-- <h3>留言板</h3> -->
                    <div class="sendword">
                        <h3>希望你的一切努力都有所回报</h3>
                         <el-divider></el-divider>
                        <img width="300px" src="../../assets/img/message/lz2.jpg" alt="">
                    </div>
                </div>
                <comments type="留言" ></comments>
            </div>
            <!-- 侧边栏 -->
            <sidebar></sidebar>
        </div>
    </div>
</template>

<script>
import sidebar from '@/components/sidebar.vue' //侧边栏
import comments from '@/components/comments.vue' //评论
export default {
    data() {
        return {
            textarea:''
        }
    },
    components:{
        sidebar,
        comments
    }
}
</script>

<style >
@import url('../../style/main/message.css');
</style>