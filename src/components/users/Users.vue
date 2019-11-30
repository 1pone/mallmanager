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
          :data="userList"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            min-width="30px">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            min-width="80px">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            min-width="170px">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话"
            min-width="110px">
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色"
            min-width="120px">
          </el-table-column>
          <el-table-column
            label="创建时间"
            min-width="100px">
<!--            如果单元格内显示的内容不是字符串（文本）需要给被显示的内容外层包裹一层template-->
<!--            template内部要用数据 设置slot-scope属性 该属性的值是要用数据create_time的数据源userList-->
<!--            slot-scope的值userList就是el-table绑定的值userList slot-scope会自动使用上一级绑定数据-->
<!--            userList.row -> 数组中的每一个对象-->
            <template slot-scope="scope">
              {{scope.row.create_time | fmtdate}}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="62px">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="148px">
            <template>
              <el-button type="primary" icon="el-icon-edit" size="small" plain circle></el-button>
              <el-button type="warning" icon="el-icon-setting" size="small" plain circle></el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" plain circle></el-button>
            </template>
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
        // 分页相关数据
        pageNum: 1,
        pageSize: 10,
        total: 0,
        // 表格绑定的数据
        userList: []
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
        const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pageNum}&pagesize=${this.pageSize}`)
        const {data: {total, users}, meta: {msg, status}} = res.data
        if (status === 200) {
          // 给表格数据赋值
          this.userList = users
          // 给total赋值
          this.total = total
          // 提示
          this.$message.success(msg)
          console.log(res)
        } else {
          this.$message.error(msg)
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
