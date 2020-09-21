import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login')
const Home = () => import('../components/Home')
const Welcome = () => import('../components/Welcome')
const Users = () => import('../components/user/Users')
const Rights = () => import('../components/power/Rights')
const Roles = () => import('../components/power/Roles')
const Cate = () => import('../components/goods/Cate')
const Params = () => import('../components/goods/Params')
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  { path:'/login',
    component:Login
  },
  { path:'/home',
    component:Home,
    redirect:'/Welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params}
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next) =>{
  if(to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if(!token) return next('/login')
  next()
})
export default router
