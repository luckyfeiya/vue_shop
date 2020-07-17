import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path:'/login',
    component: Login
  },
  {
    path:'/home',
    component: Home
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
  // to代表即将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数，表示放行
  // next() 放行  next('/login') 强制跳转
  if(to.path == '/login'){
    return next();
  }
  // 如果不是登录页，首先要获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr){
    // 说明没有token值,不能访问有权限的页面
    return next('/login');
  }else{
    next();
  }
})

export default router

