<template>
      <el-container class="container">
        <el-header class="header">
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple logo">
<!--                <img src="@/assets/logo.png" alt="logo" height="60px">--><i class="el-icon-eleme" style="line-height: 60px"></i>
              </div>
            </el-col>
            <el-col :span="12"  class="middle">
              <span style="font-size: 28px;color: #6a9c78;line-height: 60px">电商后台管理系统</span>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple" style="line-height: 60px;">
                <span style="margin-right: 10px;color: #6a9c78">欢迎您  {{username}}</span>
                <el-button size="small" @click="handleLogout" style="background-color: #6a9c78;color: #fff1bc;border-width: 0">退出</el-button>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-container>
          <el-aside  class="aside" :width="isCollapse ? '65px' : '160px'">
            <!-- 折叠展开menu的bar -->
            <div class="toggleBar" @click="isCollapse=!isCollapse">|||</div>
            <!-- menu 菜单 -->
            <el-menu
              unique-opened
              router
              :collapse="isCollapse"
              style="background-color: #6a9c78;border-right: 0">
              <el-submenu :index="item1.authName" v-for="(item1, index) in menuList" :key="index" :class="isCollapse ? 'el_submenu_small': 'el_submenu_large'">
                <template slot="title">
                  <i :class="iconList[index]" style="color: #FFF1BC"></i>
                  <span style="color: #FFF1BC">{{item1.authName}}</span>
                </template>
                <el-menu-item-group style="background-color: #c4e3cb" class="menus">
                  <el-menu-item :index="item2.path" v-for="(item2, index) in item1.children" :key="index">
                    <i class="el-icon-document" style="color: #6a9c78"></i>
                    <span style="color: #6a9c78">{{item2.authName}}</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main class="main">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
        isCollapse: false,
        username: '',
        menuList: [],
        iconList: ['el-icon-user-solid', 'el-icon-key', 'el-icon-shopping-cart-1', 'el-icon-receiving', 'el-icon-s-data'],
        iconTree: [
          {
            icon: 'el-icon-user-solid',
            children: [
              { icon: 'el-icon-document' }
            ]
          },
          {
            icon: 'el-icon-key',
            children: [
              { icon: 'el-icon-document' },
              { icon: 'el-icon-document' }
            ]
          },
          {
            icon: 'el-icon-shopping-cart-1',
            children: [
              { icon: 'el-icon-document' },
              { icon: 'el-icon-cpu' },
              { icon: 'el-icon-set-up' }
            ]
          },
          {
            icon: 'el-icon-receiving',
            children: [
              { icon: 'el-icon-document' }
            ]
          },
          {
            icon: 'el-icon-s-data',
            children: [
              { icon: 'el-icon-pie-chart' }
            ]
          }
        ]
      }
    },
    // 组件渲染之前检查token
    // beforeCreate () {
    //   const token = localStorage.getItem('token')
    //   if (!token) {
    //     // 没有token，跳转login页面
    //     this.$router.push({name: 'Login'})
    //   }
    // //  有token 继续渲染页面
    // },
    mounted () {
      this.username = localStorage.getItem('username')
      this.getMenus()
    },
    methods: {
      handleLogout () {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        this.$message.success('退出成功')
        this.$router.push({name: 'Login'})
      },
      async getMenus () {
        const res = await this.$http.get('menus')
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.menuList = res.data.data
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      }
    }
  }
</script>

<style scoped>
  .header{
    background-color: #c4e3cb;
    color: #333;
    text-align: center;
  }

  .aside {
    background-color: #6a9c78;
    color: #333;
  }

  .main {
    background-color: #f9f8ed;
    color: #333;
  }

  .container {
    height: 100%;
  }

  /*头部样式*/
  .middle {
    text-align: center;
  }

  .toggleBar {
    color: #6a9c78;
    font-size: 12px;
    line-height: 24px;
    background-color: #fff1bc;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
    user-select: none;
  }

  .el_submenu_large {
    width: 160px;
  }
  .el_submenu_small {
    width: 65px;
  }
  .menus {
    .el-menu-item-group__title {
      padding:0px !important;
    }
  }

  .el-menu-item .is-active {
    background-color: #6a9c78 !important;
  }

</style>
