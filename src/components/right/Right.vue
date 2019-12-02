<template>
  <div>
      <el-row style="margin-bottom: 20px">
        <!--      1. 面包屑-->
        <!--      1.1 首页 > 用户管理 > 用户列表-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
    <!--    卡片容器-->
    <el-card class="box-card" shadow="always">
      <el-table
        :data="rightList"
        height="500"
        border
        stripe
        style="width: 100%; margin-bottom: 20px">
        <el-table-column
          type="index"
          label="#"
          width="180">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          label="权限等级">
          <template slot-scope="scope">
            <el-tag :type="tagType[scope.row.level]">等级{{numToStr(scope.row.level)}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-tag type="info" style="float: right; margin-bottom: 20px">共 {{rightList.length}} 条</el-tag>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Right',
    data () {
      return {
        rightList: [],
        tagType: ['', 'success', 'warning']
      }
    },
    mounted () {
      this.getRightList('list')
      console.log(this.numToStr(1))
    },
    methods: {
      // 获取权限列表
      async getRightList (type) {
        const AUTH_TOKEN = localStorage.getItem('token') // 从localStorage获取token
        this.$http.defaults.headers.Authorization = AUTH_TOKEN // 设置请求头
        const res = await this.$http.get(`rights/${type}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.rightList = res.data.data
          this.$message.success(msg)
        }
      },
      // 权限等级数字转中文
      numToStr (num) {
        const nzhcn = require('nzh/cn')
        return nzhcn.encodeS(parseInt(num) + 1)
      }
    }
  }
</script>

<style scoped>
</style>
