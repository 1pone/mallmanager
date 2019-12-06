<template>
  <div>
    <el-row>
      <!--      1. 面包屑-->
      <!--      1.1 首页 > 用户管理 > 用户列表-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--    卡片容器-->
    <el-card class="box-card" shadow="always">
      <!--      2. 搜索框-->
      <el-row style="margin-top: 15px" :gutter="20">
        <el-col>
          <el-input
            placeholder="搜索商品"
            v-model="query" clearable
            @clear="getGoodsList"
            @change="getGoodsList"
            style="max-width: 300px; margin-right: 15px">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
          <el-button type="primary" @click="$router.push({name:'AddGood'})">添加商品</el-button>
        </el-col>
      </el-row>
      <!--      3. 用户表格-->
      <el-row>
        <el-table
          :data="goodsList"
          v-loading="loading"
          border
          stripe
          height= "620px"
          style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            min-width="30px">
          </el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称"
            min-width="240px">
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格(元)"
            min-width="120px">
          </el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量"
            min-width="80px">
          </el-table-column>
          <el-table-column
            label="创建时间"
            min-width="110px">
            <template slot-scope="scope">
              {{scope.row.add_time * 1000 | fmtdate}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            min-width="100px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" circle @click="dialogEditVisible = true,selectedUser = JSON.parse(JSON.stringify(scope.row))"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" circle @click="delGoods(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!--      4. 分页-->
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="page_sizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
      <!--      添加用户对话框表单-->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="dialogClose('formAdd')">
        <el-form :model="formAdd" :rules="rules" ref="formAdd" status-icon>
          <el-form-item label="用户名" prop="username" :label-width="labelWidth">
            <el-input v-model="formAdd.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :label-width="labelWidth">
            <el-input v-model="formAdd.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="passwordConfirm" :label-width="labelWidth">
            <el-input v-model="formAdd.passwordConfirm" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :label-width="labelWidth">
            <el-input v-model="formAdd.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" :label-width="labelWidth">
            <el-input v-model="formAdd.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogClose('formAdd')">取 消</el-button>
          <el-button type="primary" @click="addUser('formAdd')">确 定</el-button>
        </div>
      </el-dialog>
      <!--      修改用户信息框表单-->
      <el-dialog title="修改用户信息" :visible.sync="dialogEditVisible" @close="dialogClose('editForm')">
        <el-form :model="selectedGood" :rules="rules" ref="editForm" status-icon>
          <el-form-item label="用户名" :label-width="labelWidth">
            <el-input v-model="selectedGood.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :label-width="labelWidth">
            <el-input v-model="selectedGood.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" :label-width="labelWidth">
            <el-input v-model="selectedGood.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogClose('editForm')">取 消</el-button>
          <el-button type="primary" @click="editUser('editForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Goods',
    data () {
      return {
        loading: false,
        dialogFormVisible: false,
        dialogEditVisible: false,
        goodsList: [],
        total: 0,
        labelWidth: '120px',
        formAdd: {},
        selectedGood: {},
        // 分页相关数据
        query: '',
        pageNum: 1,
        pageSize: 10,
        page_sizes: [10, 20, 30, 40]
      }
    },
    mounted () {
      this.getGoodsList()
    },
    methods: {
      // 获取商品数据列表
      async getGoodsList () {
        this.loading = true // 表格加载动效
        // 参数名 参数说明 备注
        // query 查询参数 可以为空
        // pagenum 当前页码 不能为空
        // pagesize 每页显示条数 不能为空
        const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pageNum}&pagesize=${this.pageSize}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          const {data: {total, goods}} = res.data
          this.loading = false
          // 给表格数据赋值
          this.goodsList = goods
          // 给total赋值
          this.total = total
          // 提示
          // this.$message.success(msg)
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 删除商品
      delGoods (id) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`goods/${id}`)
          const {meta: {msg, status}} = res.data
          if (status === 200) {
            this.$message.success(msg)
            this.getGoodsList()
          } else {
            this.$message.error(`${status} : ${msg}`)
          }
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },

      // 列表分页
      // 1. 修改每页数据显示条数
      handleSizeChange (val) {
        this.pageSize = val
        this.pageNum = 1 // 每页数据条数改变时重新返回第一页
        this.getGoodsList()
      },
      // 2. 修改当前页码
      handleCurrentChange (val) {
        this.pageNum = val
        this.getGoodsList()
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
</style>
