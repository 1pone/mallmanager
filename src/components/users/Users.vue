<template>
  <div>
<!--    卡片容器-->
    <el-card class="box-card" shadow="never">
      <el-row>
<!--      1. 面包屑-->
<!--      1.1 首页 > 用户管理 > 用户列表-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
<!--      2. 搜索框-->
      <el-row style="margin-top: 15px" :gutter="20">
        <el-col>
          <el-input placeholder="搜索用户" v-model="query" style="max-width: 300px; margin-right: 15px">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
<!--      3. 用户表格-->
      <el-row>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            width="40">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="80">
          </el-table-column>
          <el-table-column
            prop="address"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="address"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="address"
            label="角色">
          </el-table-column>
          <el-table-column
            prop="address"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Users',
    data () {
      return {
        query: '',
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        pagenum: 1,
        pagesize: 10
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      async getUserList () {
        // 参数名 参数说明 备注
        // query 查询参数 可以为空
        // pagenum 当前页码 不能为空
        // pagesize 每页显示条数 不能为空
        // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
        const AUTH_TOKEN = localStorage.getItem('token') // 从localStorage获取token
        this.$http.defaults.headers.Authorization = AUTH_TOKEN // 设置请求头
        const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        if (res) {
          console.log(res)
        }
      }
    }
  }
</script>

<style scoped>
  .box-card {
    height: 100%;
  }
  .el-row {
    margin-bottom: 20px;
  }
</style>
