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
          <el-input
            placeholder="搜索用户"
            v-model="query" clearable
            @clear="getUserList"
            @change="getUserList"
            style="max-width: 300px; margin-right: 15px">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
<!--      3. 用户表格-->
      <el-row>
        <el-table
          :data="userList"
          v-loading="loading"
          border
          height= "400px"
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
            min-width="120px">
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
              {{scope.row.create_time*1000 | fmtdate}}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="62px">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="editState(scope.row.id, scope.row.mg_state)"
                active-color="#13ce66"
                inactive-color="#F56C6C">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="148px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" circle @click="selectedUser = scope.row , dialogEditVisible = true"></el-button>
              <el-button type="warning" icon="el-icon-setting" size="small" circle @click="getRoleList(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" circle @click="delUser(scope.row.id)"></el-button>
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
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="dialogClose('addForm')">
        <el-form :model="addForm" :rules="rules" ref="addForm" status-icon>
          <el-form-item label="用户名" prop="username" :label-width="labelWidth">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :label-width="labelWidth">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="passwordConfirm" :label-width="labelWidth">
            <el-input v-model="addForm.passwordConfirm" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :label-width="labelWidth">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" :label-width="labelWidth">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogClose('addForm')">取 消</el-button>
          <el-button type="primary" @click="addUser('addForm')">确 定</el-button>
        </div>
      </el-dialog>
<!--      修改用户信息框表单-->
      <el-dialog title="修改用户信息" :visible.sync="dialogEditVisible" @close="dialogClose('editForm')">
        <el-form :model="selectedUser" :rules="rules" ref="editForm" status-icon>
          <el-form-item label="用户名" :label-width="labelWidth">
            <el-input v-model="selectedUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :label-width="labelWidth">
            <el-input v-model="selectedUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" :label-width="labelWidth">
            <el-input v-model="selectedUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogClose('editForm')">取 消</el-button>
          <el-button type="primary" @click="editUser('editForm')">确 定</el-button>
        </div>
      </el-dialog>
<!--      分配用户角色框表单，添加选择框及方法-->
      <el-dialog title="分配角色" :visible.sync="dialogRoleVisible" @close="dialogClose">
        <el-form :model="selectedUser" :rules="rules" ref="editForm" status-icon>
          <el-form-item label="当前用户" :label-width="labelWidth">
            <span style="padding: 0px 15px">{{selectedUser.username}}</span>
          </el-form-item>
          <el-form-item label="当前角色" :label-width="labelWidth">
            <span style="padding: 0px 15px">{{selectedUser.role_name}}</span>
          </el-form-item>
          <el-form-item label="新分配的角色" :label-width="labelWidth">
            <el-select v-model="selectedValue" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogClose">取 消</el-button>
          <el-button type="primary" @click="setUserRole">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Users',
    data () {
      // 在 data() 中，且 return 之前，自定义一些表单校验规则
      // 校验密码
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.addForm.passwordConfirm !== '') {
            // 当输入密码后密码校验框的值为非空时，立刻执行passwordConfirm字段校验
            this.$refs.addForm.validateField('passwordConfirm') // validateField() 对部分表单字段进行校验的方法
          }
          // 校验通过
          callback()
        }
      }

      // 二次校验密码
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.addForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

      // 校验邮箱
      const checkEmail = (rule, value, callback) => {
        if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) === false && value !== '') {
          return callback(new Error('邮箱地址不正确'))
        }
        callback()
      }

      // 校验手机号
      const checkMobile = (rule, value, callback) => {
        if (/^1\d{10}$/.test(value) === false && value !== '') {
          return callback(new Error('手机号不正确'))
        }
        callback()
      }

      return {
        query: '', // 查询参数
        // 表格绑定的数据
        userList: [], // 用户列表
        // 对话框表单
        dialogFormVisible: false,
        loading: false,
        labelWidth: '120px',
        // 添加用户表单请求参数
        // 参数名 参数说明 备注
        // username 用户名称 不能为空
        // password 用户密码 不能为空
        // email 邮箱 可以为空
        // mobile 手机号 可以为空
        addForm: {
          username: '',
          password: '',
          passwordConfirm: '',
          email: '',
          mobile: ''
        },
        submitDisable: false, // 防止连续点击表单数据重复提交
        // 表单规则
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' },
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ],
          passwordConfirm: [
            { validator: validatePass2, trigger: 'blur' },
            { required: true, message: '请再次输入密码', trigger: 'blur' }
          ],
          email: [
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        // 用户编辑的表单数据
        dialogEditVisible: false,
        selectedUser: {}, // 编辑用户和角色分配共用
        // 角色分配
        dialogRoleVisible: false,
        roleList: [],
        selectedValue: '',
        // 分页相关数据
        pageNum: 1, //
        pageSize: 2, // 每页数据条数
        page_sizes: [2, 4, 6, 8], // 数据条数集合
        total: 0 // 数据总条数
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      // 获取用户数据列表
      async getUserList () {
        this.loading = true // 表格加载动效
        // 参数名 参数说明 备注
        // query 查询参数 可以为空
        // pagenum 当前页码 不能为空
        // pagesize 每页显示条数 不能为空
        // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
        const AUTH_TOKEN = localStorage.getItem('token') // 从localStorage获取token
        this.$http.defaults.headers.Authorization = AUTH_TOKEN // 设置请求头
        const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pageNum}&pagesize=${this.pageSize}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          const {data: {total, users}} = res.data
          this.loading = false
          // 给表格数据赋值
          this.userList = users
          // 给total赋值
          this.total = total
          // 提示
          this.$message.success(msg)
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 关闭添加对话框(添加用户、编辑用户、分配权限共用)
      dialogClose (formName) {
        this.dialogFormVisible = false
        this.dialogEditVisible = false
        this.dialogRoleVisible = false
        if (typeof formName !== 'undefined' && typeof formName !== 'object') { // 分配权限无传参
          this.$refs[formName].resetFields() // 清空添加用户、编辑用户表单数据
        } else {
          this.selectedValue = '' // 清空选择器value
        }
        // 清空表单数据
        // 方法一 直接赋值空对象，在input时重新创建对象
        // this.addForm = {}
        // 方法二 遍历清空数组
        // for (let key in this.addForm) {
        //   if (this.addForm.hasOwnProperty(key)) {
        //     this.addForm[key] = ''
        //   }
        // }
        // 方法三 重新赋值
        // this.addForm = {username: '', password: '', email: '', mobile: ''}
        // 方法四 this.$refs[addFormName].resetFields()
      },

      // 添加用户
      addUser (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (!this.submitDisable) { // 防止数据重复提交
              this.submitDisable = true
              const res = await this.$http.post('/users', this.addForm)
              const {meta: {msg, status}} = res.data
              if (status === 201) {
                this.getUserList()
                this.$message.success(msg)
              } else {
                this.$message.error(`${status} : ${msg}`)
              }
              this.dialogClose(formName)
            }
          }
          setTimeout(() => {
            this.submitDisable = false
          }, 3000) // 锁定提交3s防止数据重复提交
        })
      },

      // 修改用户信息
      editUser (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.dialogEditVisible = true
            const res = await this.$http.put(`/users/${this.selectedUser.id}`, this.selectedUser)
            const {meta: {msg, status}} = res.data
            if (status === 200) {
              this.getUserList()
              this.$message.success(msg)
            } else {
              this.$message.error(`${status} : ${msg}`)
            }
            this.dialogClose(formName)
          }
        })
      },

      // 修改用户状态
      async editState (id, state) {
        const res = await this.$http.put(`users/${id}/state/${state}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.getUserList()
          this.$message.success(msg)
        }
      },

      // 获取用户角色列表
      async getRoleList (selectedUser) {
        this.selectedUser = selectedUser
        this.dialogRoleVisible = true
        const res = await this.$http.get('roles')
        const {meta: {status}} = res.data
        if (status === 200) {
          this.roleList = res.data.data
        }
      },

      // 分配用户角色
      async setUserRole () {
        const res = await this.$http.put(`users/${this.selectedUser.id}/role`,{rid: this.selectedValue})
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
        this.dialogClose()
        this.getUserList()
      },

      // 删除用户
      delUser (id) {
        // 此处采用MessageBox弹框，也可使用更轻量的Popover嵌套弹出框或者Popconfirm气泡确认框
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`users/${id}`)
          const {meta: {msg, status}} = res.data
          if (status === 200) {
            this.$message.success(msg)
            console.log('删除成功!')
            this.getUserList()
          } else {
            this.$message.error(msg)
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
        this.getUserList()
      },
      // 2. 修改当前页码
      handleCurrentChange (val) {
        this.pageNum = val
        this.getUserList()
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
