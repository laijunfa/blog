// 后台管理 路由配置
export default [
    {
        path:'/admin',
        name:'后台管理首页',
        component:()=> import('@/views/admin/index/index.vue'),
        meta:{role:0},
        // 嵌套路由
        children:[
            {
                path:'home',
                name:'系统首页',
                component:()=> import('@/views/admin/home/home.vue')
            },
            {
                path:'chart',
                name:'统计分析',
                component:()=> import('@/views/admin/chart/chart.vue')
            },
            {
                path:'user',
                name:'用户管理',
                component:()=> import('@/views/admin/user/userlist.vue')
            },
            {
                path:'article',
                name:'文章管理',
                component:()=> import('@/views/admin/article/article.vue')
            },
            {
                path:'message',
                name:'留言管理',
                component:()=> import('@/views/admin/message/message.vue')
            },
        ]
    },
    {
        path:'/login',
        name:'登录',
        component:()=> import('@/views/admin/login/login.vue')
    },
    
]