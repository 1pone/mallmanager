<template>
  <div>
    <el-row>
      <!--      1. 面包屑-->
      <!--      1.1 首页 > 用户管理 > 用户列表-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--    卡片容器-->
    <el-card class="box-card" shadow="always">
      <!--      2. 搜索框-->
      <el-row style="margin-top: 15px" :gutter="20">
        <el-col>
          <el-input
            placeholder="搜索用户"
            v-model="query" clearable
            @clear="getOrderList"
            @change="getOrderList"
            style="max-width: 300px; margin-right: 15px">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--      3. 用户表格-->
      <el-row>
        <el-table
          :data="orderList"
          v-loading="loading"
          border
          stripe
          style="width: 100%;max-height: 733px;overflow: auto">
          <el-table-column
            type="index"
            label="#"
            align="center"
            min-width="30px">
          </el-table-column>
          <el-table-column
            prop="order_number"
            label="订单编号"
            align="center"
            min-width="200px">
          </el-table-column>
          <el-table-column
            prop="order_price"
            label="订单价格"
            align="center"
            min-width="100px">
          </el-table-column>
          <el-table-column
            label="是否付款"
            align="center"
            min-width="100px">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.pay_status === '0'" :type="payStatus[0].type">{{payStatus[0].name}}</el-tag>
              <el-tag v-else :type="payStatus[1].type">{{payStatus[1].name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_send"
            label="是否发货"
            align="center"
            min-width="100px">
          </el-table-column>
          <el-table-column
            label="下单时间"
            align="center"
            min-width="100px">
            <template slot-scope="scope">
              {{scope.row.create_time*1000 | fmtdate}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            min-width="100px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" circle @click="dialogOpen"></el-button>
              <el-button type="success" icon="el-icon-location" size="small" circle @click="showWuliuDialog"></el-button>
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
      <!--      修改用户信息框表单-->
      <el-dialog title="修改地址" :visible.sync="dialogEditVisible" @close="dialogClose('editForm')">
        <el-form :model="selectedOrder" ref="editForm" status-icon>
          <el-form-item label="省市区/县" prop="mobile" :label-width="labelWidth">
            <!--                  级联选择器-->
            <el-cascader
              v-model="selectedOptions"
              :options="cityList"
              :props="defaultProp"
              filterable
            style="width: 100%"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" :label-width="labelWidth">
            <el-input v-model="selectedOrder.address"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogClose">取 消</el-button>
          <el-button type="primary" @click="editAddress">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import cityList from '../../assets/city_data2017_element'
  export default {
    name: 'Order',
    data () {
      return {
        loading: false,
        dialogEditVisible: false,
        labelWidth: '120px',
        query: '',
        orderList: [],
        total: 0,
        payStatus: [
          {type: 'danger', name: '未付款'},
          {type: 'success', name: '已付款'}
        ],
        selectedOrder: [],
        // 分页相关数据
        pageNum: 1, //
        pageSize: 6, // 每页数据条数
        page_sizes: [6, 12, 18], // 数据条数集合
        // 级联选择器绑定的数据
        selectedOptions: [], // 选中的数据
        cityList: [], // 选择器的数据源
        // 级联选择器配置选项
        defaultProp: {
          label: 'label',
          value: 'value',
          children: 'children',
          expandTrigger: 'hover'
        }
      }
    },
    created () {
      this.getOrderList()
    },
    methods: {
      // 获取用户数据列表
      async getOrderList () {
        this.loading = true // 表格加载动效
        // 参数名 参数说明 备注
        // query 查询参数 可以为空
        // pagenum 当前页码 不能为空
        // pagesize 每页显示条数 不能为空
        const res = await this.$http.get(`orders?query=${this.query}&pagenum=${this.pageNum}&pagesize=${this.pageSize}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          const {data: {total, goods}} = res.data
          this.loading = false
          // 给表格数据赋值
          this.orderList = goods
          // 给total赋值
          this.total = total
          // 提示
          // this.$message.success(msg)
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 打开修改地址对话框
      dialogOpen () {
        this.dialogEditVisible = true
        this.cityList = cityList
      },

      // 编辑物流地址
      editAddress () {
        this.$message.success('地址更新成功')
        this.dialogClose()
      },

      dialogClose () {
        this.dialogEditVisible = false
        this.selectedOptions = []
        this.selectedOrder = []
      },

      // 打开物流信息对话框
      showWuliuDialog () {
        this.$message.error('获取物流信息失败！')
      },

      // 列表分页
      // 1. 修改每页数据显示条数
      handleSizeChange (val) {
        this.pageSize = val
        this.pageNum = 1 // 每页数据条数改变时重新返回第一页
        this.getOrderList()
      },
      // 2. 修改当前页码
      handleCurrentChange (val) {
        this.pageNum = val
        this.getOrderList()
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
</style>
