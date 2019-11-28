<template>
      <el-container class="container">
        <el-header class="header">
          <el-row>
            <el-col :span="4">
              <div class="grid-content bg-purple logo">
                <img src="@/assets/logo.png" alt="logo" height="60px">
              </div>
            </el-col>
            <el-col :span="18"  class="middle">
              <h3>电商后台管理系统</h3>
            </el-col>
            <el-col :span="2">
              <div class="grid-content bg-purple">
                <a href="#" class="logout">退出</a>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-container>
          <el-aside  class="aside" width="200px">
            <el-menu default-active="1" unique-opened router>
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-user-solid"></i>
                  <span>用户管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1">
                    <i class="el-icon-document"></i>
                    <span>用户列表</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-key"></i>
                  <span>权限管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="2-1">
                    <i class="el-icon-document"></i>
                    <span>角色列表</span>
                  </el-menu-item>
                  <el-menu-item index="2-2">
                    <i class="el-icon-document"></i>
                    <span>权限列表</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-shopping-cart-1"></i>
                  <span>商品管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="3-1">
                    <i class="el-icon-document"></i>
                    <span>商品列表</span>
                  </el-menu-item>
                  <el-menu-item index="3-2">
                    <i class="el-icon-cpu"></i>
                    <span>分类参数</span>
                  </el-menu-item>
                  <el-menu-item index="3-3">
                    <i class="el-icon-set-up"></i>
                    <span>商品分类</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-receiving"></i>
                  <span>订单管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="4-1">
                    <i class="el-icon-document"></i>
                    <span>订单列表</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="5">
                <template slot="title">
                  <i class="el-icon-s-data"></i>
                  <span>数据统计</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="5-1">
                    <i class="el-icon-pie-chart"></i>
                    <span>数据报表</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main class="main">Main</el-main>
        </el-container>
      </el-container>
</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {}
    },
    // 组件渲染之前检查token
    beforeCreate () {
      const token = localStorage.getItem('token')
      if (!token) {
        // 没有token，跳转login页面
        this.$router.push({name: 'Login'})
      }
    //  有token 继续渲染页面
    }
  }
</script>

<style scoped>
  .header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
  }

  .aside {
    background-color: #D3DCE6;
    color: #333;
  }

  .main {
    background-color: #E9EEF3;
    color: #333;
  }

  .container {
    height: 100%;
  }

  /*头部样式*/
  .middle {
    text-align: center;
  }

  .logout {
    text-decoration: none;
    line-height: 60px;
  }
</style>
