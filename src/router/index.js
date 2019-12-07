import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Welcome from '@/components/home/Welcome'
import Users from '@/components/users/Users'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
import GoodsList from '@/components/goods/GoodsList'
import AddGood from '@/components/goods/AddGood'
import Params from '@/components/goods/Params'
import Categories from '@/components/goods/Categories'
import Orders from '@/components/orders/Orders'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          name: 'Welcome',
          path: '/welcome',
          component: Welcome
        }, {
          name: 'Users',
          path: '/users',
          component: Users
        }, {
          name: 'Rights',
          path: '/rights',
          component: Rights
        }, {
          name: 'Roles',
          path: '/roles',
          component: Roles
        }, {
          name: 'GoodsList',
          path: '/goods',
          component: GoodsList
        }, {
          name: 'AddGood',
          path: '/addGood',
          component: AddGood
        }, {
          name: 'Params',
          path: '/params',
          component: Params
        }, {
          name: 'Categories',
          path: '/categories',
          component: Categories
        }, {
          name: 'Orders',
          path: '/orders',
          component: Orders
        }
      ]
    }
  ]
})

// 路由导航守卫，在路由生效前执行，统一判断token
// to -> 要去的路由配置
// from -> 当前的路由配置
// next -> 继续执行
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      // 没有token，跳转login页面
      router.push({name: 'Login'})
    } else {
      next()
    }
    //  有token 继续渲染页面
  }
})

export default router
