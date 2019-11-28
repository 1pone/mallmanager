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
          <el-aside  class="aside" width="200px">Aside</el-aside>
          <el-main class="main">Main</el-main>
        </el-container>
      </el-container>
</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {}
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
