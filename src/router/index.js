import Vue from 'vue';
import VueRouter from 'vue-router';
import home from '../views/main/home.vue';//首页
import player from '../views/main/musicPlayer.vue';//音乐播放器
import adminRouter from './admin/admin.js' //后台管理路由
import store from '../store/index'
//注册路由
Vue.use(VueRouter);

let routes=[
    //默认为home
    {
        path:'/',
        redirect:'blogs/home',
    },
    // 所有人都可以访问的路由
    {
        path:'/blogs',
        component:()=>import('@/views/main/main.vue'),
        redirect:'blogs/home',
        children:[
            {
                path:'home',
                name:'首页',
                component:()=>import('@/views/main/home.vue')
            },
            {
                path:'handbook',
                name:'教学手册',
                component:()=>import('@/views/main/handbook.vue')
            },
            {
                path:'player',
                name:'音乐播放器',
                component:player
            },
            {
                path:'message',
                name:'留言板',
                component:()=>import('@/views/main/message.vue')
            },
            {
                path:'article',
                name:'文章详情',
                component:()=>import('@/views/main/article.vue')
            },
            {
                path:'question',
                name:'题库',
                component:()=>import('@/views/main/question/question.vue'),
            },
            {
                path:'question/examination',
                name:'examination',
                component:()=>import('@/views/main/question/examination.vue')
            },
            {
                path:'question/assess',
                name:'assess',
                component:()=>import('@/views/main/question/assess.vue')
            },
        ]
    },
    // {
    //     path:'/carousel',
    //     name:'轮播',
    //     component:()=>import('../components/carousel.vue')
    // },
    //找不到页面时跳转到主页
    {
        path:'*',
        redirect:'blogs/home',
    }
]
// console.log('后台管理路由',...adminRouter);
//将后台管理路由添加进去
routes.push(...adminRouter);
//实例化路由
const router=new VueRouter({
    routes
})
// 路由守卫
router.beforeEach((to,from,next)=>{
    // 判断是否为管理员界面,如果没登录不能进入
    if(to.path.indexOf("admin")!=-1){
        if(store.state.userInfo.u_role!=0 && !store.state.userInfo.token){
            //未登录
            next('/login');
        }else{
            //已经登录
            next();
        }
    }else{
        next();
    }
    
});
//导出路由
export default router