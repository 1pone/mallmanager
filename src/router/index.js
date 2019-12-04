import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Welcome from '@/components/home/Welcome'
import Users from '@/components/users/Users'
import Right from '@/components/power/Right'
import Role from '@/components/power/Role'

Vue.use(Router)

export default new Router({
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
          name: 'Right',
          path: '/right',
          component: Right
        }, {
          name: 'Role',
          path: '/role',
          component: Role
        }
      ]
    }
  ]
})
