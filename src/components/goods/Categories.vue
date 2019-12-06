<template>
  <div>
    <el-row>
      <!--      1. 面包屑-->
      <!--      1.1 首页 > 用户管理 > 用户列表-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--    卡片容器-->
    <el-card class="box-card" shadow="always">
      <!--      2. 搜索框-->
      <el-row>
          <el-button type="primary" @click="openDialogAdd">添加商品</el-button>
      </el-row>
      <!--      3. 用户表格-->
      <el-row style="min-height: 400px">
        <el-table
          :data="CateList"
          v-loading="loading"
          border
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            align="center"
            min-width="30px">
          </el-table-column>
          <el-table-column
            prop="cat_name"
            label="分类名称"
            align="center"
            min-width="160px">
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="是否有效"
            align="center"
            min-width="100px"><template slot-scope="scope">
            <i :class="scope.row.cat_deleted ? 'el-icon-error' : 'el-icon-success'" :style="scope.row.cat_deleted ? 'color:#F56C6C' : 'color:#6a9c78'"></i>
          </template>
          </el-table-column>
          <el-table-column
            prop="goods_weight"
            label="排序"
            align="center"
            min-width="100px">
            <template slot-scope="scope">
              <el-tag :type="tagType[scope.row.level]">等级{{numToStr(scope.row.cat_level)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            min-width="100px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" circle @click="dialogEditVisible = true,selectedAttr = JSON.parse(JSON.stringify(scope.row))"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" circle @click="delCate(scope.row.cat_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!--      4. 分页-->
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getListParams.pagenum"
          :page-sizes="pageSizes"
          :page-size="getListParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
      <!--      添加商品对话框表单-->
      <el-dialog title="添加商品" :visible.sync="dialogFormVisible" @close="dialogCloseAdd">
        <el-form :model="formAdd" ref="formAdd" status-icon>
          <el-form-item label="分类名称" prop="cat_name" :label-width="labelWidth">
            <el-input v-model="formAdd.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" :label-width="labelWidth">
            <!--                  级联选择器-->
            <el-cascader
              v-model="selectedOptions"
              :options="options"
              :props="defaultProp"
              style="width: 100%"
              filterable></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCloseAdd">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </div>
      </el-dialog>
      <!--      修改用户信息框表单-->
      <el-dialog title="修改用户信息" :visible.sync="dialogEditVisible" @close="dialogEditVisible = false">
        <el-form :model="selectedAttr" ref="editForm" status-icon>
          <el-form-item label="分类名称" :label-width="labelWidth">
            <el-input v-model="selectedAttr.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCateName">确 定</el-button>
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
        // 获取分类列表时候的参数对象
        getListParams: {
          type: 3, // 获取三级分类
          pagenum: 1, // 默认 展示第一页数据
          pagesize: 6 // 默认 每页显示5条数据
        },
        pageSizes: [6, 12, 18],
        tagType: ['', 'success', 'warning'],
        CateList: [],
        total: 0,
        // 级联选择器绑定的数据
        selectedOptions: [], // 选中的数据
        options: [], // 选择器的数据源
        // 级联选择器配置选项
        defaultProp: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
          expandTrigger: 'hover',
          checkStrictly: true
        },
        labelWidth: '120px',
        formAdd: {
          cat_pid: 0,
          cat_level: 0,
          cat_name: ''
        },
        // 编辑删除时选中的行数据
        selectedAttr: {},
        // 分页相关数据
        query: ''
      }
    },
    mounted () {
      this.getCategories(1)
    },
    methods: {
      // 获取商品数据列表
      async getCategories () {
        this.loading = true // 表格加载动效
        // 参数名 参数说明 备注
        // query 查询参数 可以为空
        // pagenum 当前页码 不能为空
        // pagesize 每页显示条数 不能为空
        const res = await this.$http.get(`categories`, {params: this.getListParams})
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          const {data: {total, result}} = res.data
          this.loading = false
          // 给表格数据赋值
          this.CateList = result
          // 给total赋值
          this.total = total
          // 提示
          // this.$message.success(msg)
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 获取商品分类
      async getCate () {
        const res = await this.$http.get(`categories?type=2`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          // this.$message.success(msg)
          const data = res.data.data
          this.options = data
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 打开添加商品对话框
      openDialogAdd () {
        this.dialogFormVisible = true
        this.getCate()
      },

      // 关闭添加商品对话框
      dialogCloseAdd () {
        this.dialogFormVisible = false
        this.formAdd = { cat_pid: 0, cat_level: 0, cat_name: '' }
        this.selectedOptions = []
      },

      // 添加分类
      async addCate () {
        const param = this.formAdd
        if (this.selectedOptions.length !== 0) {
          param.cat_pid = this.selectedOptions[this.selectedOptions.length - 1]
          param.cat_level = this.selectedOptions.length
        }
        const res = await this.$http.post('categories', param)
        const {meta: {msg, status}} = res.data
        if (status === 201) {
          this.$message.success(msg)
          this.getCategories()
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
        this.dialogCloseAdd()
      },

      // 编辑提交分类
      async editCateName () {
        const res = await this.$http.put(`categories/${this.selectedAttr.cat_id}`, {cat_name: this.selectedAttr.cat_name})
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.getCategories()
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
        this.dialogEditVisible = false
      },

      // 删除分类
      delCate (id) {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`categories/${id}`)
          const {meta: {msg, status}} = res.data
          if (status === 200) {
            this.$message.success(msg)
            this.getCategories()
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
        this.getListParams.pagesize = val
        this.getListParams.pagesum = 1 // 每页数据条数改变时重新返回第一页
        this.getCategories()
      },
      // 2. 修改当前页码
      handleCurrentChange (val) {
        this.getListParams.pagenum = val
        this.getCategories()
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
  .el-row {
    margin-bottom: 20px;
  }
</style>
