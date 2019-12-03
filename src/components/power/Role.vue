<template>
  <div>
    <el-row style="margin-bottom: 20px">
      <!--      1. 面包屑-->
      <!--      1.1 首页 > 用户管理 > 用户列表-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--    卡片容器-->
    <el-card class="box-card" shadow="always">
      <el-row>
<!--        2. 添加角色-->
        <el-button type="primary" @click="dialogAddVisible=true">添加角色</el-button>
        <el-tag type="info" style="float: right;margin: 4px auto">共 {{roleList.length}} 条</el-tag>
        <el-dialog title="添加角色" :visible.sync="dialogAddVisible" @close="dialogClose('formAdd')">
          <el-form :model="form" :rules="formRules" ref="formAdd" status-icon>
            <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
              <el-input v-model="form.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
              <el-input v-model="form.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogClose('formAdd')">取 消</el-button>
            <el-button type="primary" @click="addRole('formAdd')">确 定</el-button>
          </div>
        </el-dialog>
      </el-row>
      <el-row>
<!--        表格-->
        <el-table
          :data="roleList"
          v-loading="loading"
          height="500"
          border
          stripe
          style="width: 100%; margin-bottom: 20px">
          <el-table-column
            type="expand"
            width="40">
            <template slot-scope="scope">
              <el-table label-position="left" inline class="demo-table-expand" data="scope.row.children">
                <el-table-column
                prop="authName"
                width="180">
                </el-table-column>
                <el-table-column
                  prop="name"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="address">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="#"
            align="center"
            min-width="30">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            label="描述"
            min-width="120">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            min-width="148px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" circle @click="dialogOpen(JSON.parse(JSON.stringify(scope.row)))"></el-button>
              <el-button type="warning" icon="el-icon-setting" size="small" circle @click="getRoleList(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" circle @click="delRole(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
<!--      编辑角色信息-->
      <el-dialog title="编辑角色信息" :visible.sync="dialogEditVisible" @close="dialogClose('formEdit')">
        <el-form :model="form" :rules="formRules" ref="formEdit" status-icon>
          <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
            <el-input v-model="form.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
            <el-input v-model="form.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogClose('formEdit')">取 消</el-button>
          <el-button type="primary" @click="editRole('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
    </div>
</template>

<script>
  export default {
    name: 'Role',
    data () {
      return {
        dialogAddVisible: false,
        dialogEditVisible: false,
        loading: false,
        formLabelWidth: '120px',
        roleList: [],
        selectedRole: {},
        submitDisable: false,
        form: {
          roleName: '',
          roleDesc: ''
        },
        formRules: {
          roleName: [
            { required: true, message: '请输入角色名', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          roleDesc: [
            { max: 20, message: '长度不超过 20 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.getRoleList()
    },
    methods: {
      // 获取角色列表
      async getRoleList () {
        this.loading = true
        const res = await this.$http.get('roles')
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.loading = false
          this.roleList = res.data.data
          // this.$message.success(msg)
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 关闭对话框
      dialogClose (formName) {
        this.dialogAddVisible = false
        this.dialogEditVisible = false
        if (typeof formName !== 'undefined' && typeof formName !== 'object') {
          this.$refs[formName].resetFields()
        }
      },

      // 添加用户角色
      addRole (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (!this.submitDisable) { // 防止数据重复提交
              this.submitDisable = true
              const res = await this.$http.post('roles', this.form)
              const {meta: {msg, status}} = res.data
              if (status === 201) {
                this.getRoleList()
                this.$message.success(msg)
              } else {
                this.$message.error(`${status} : ${msg}`)
              }
              this.dialogClose()
            }
          }
          setTimeout(() => {
            this.submitDisable = false
          }, 3000) // 锁定提交3s防止数据重复提交
        })
      },

      // 打开对话框
      dialogOpen (form) {
        this.dialogEditVisible = true
        this.$nextTick(() => {
          this.form = form
        })
      },

      // 编辑角色
      // 发现bug -- 12.02
      //  1.表单input与el-table-column数据绑定（已解决）2.且resetFields()重置初始值为第一次点击获取的scope.row而非空值
      //  导致表单取消后点击另一行数据再取消数据被置为上一行数据
      //  此问题同样存在于user用户编辑页
      //      教学视频解决方法：编辑框中的数据通过id查询而非直接从行数据获取，使两者数据隔离，且新建表单和编辑表单采用独立对象存储
      // --------------------------------------------------------------------------------------------
      // 发现原因 ——— 12.03
      // 1. JS 的引用赋值与传值赋值 https://segmentfault.com/a/1190000018347348?utm_source=tag-newest
      //  number,string类型都是基本类型，而基本类型存放在栈区，访问时按值访问，赋值是按照普通方式赋值；
      //  对象和数组是通过引用来赋值的，两个对象指向相同的内存地址，所以改变a的同时b也会跟着改变。
      //      解决方法：JSON.parse(JSON.stringify(obj))  创建一个新的相同对象而不是引用对象
      // 2. 表单数据对象赋值早于form的mounted结束，使得第一次的表单数据成为了默认初始值 https://blog.csdn.net/u013675978/article/details/83536242
      //      解决方法：在打开对话框显示表单时不要直接做赋值操作，加上this.$nextTick(),在其中进行数据赋值保form已经mounted结束
      async editRole (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (!this.submitDisable) { // 防止数据重复提交
              this.submitDisable = true
              const res = await this.$http.put(`roles/${this.form.id}`, this.form)
              const {meta: {msg, status}} = res.data
              if (status === 200) {
                this.$message.success(msg)
                this.dialogClose(formName)
                this.getRoleList()
              } else {
                this.$message.error(`${status} : ${msg}`)
              }
            }
          }
          setTimeout(() => {
            this.submitDisable = false
          }, 3000) // 锁定提交3s防止数据重复提交
        })
      },

      // 关闭编辑角色对话框(使用resetFields()有问题，重置后的数据为第一次点击后的数据而不是空数据)
      // dialogEditClose () {
      //   this.dialogEditVisible = false
      //   this.form = { roleName: '', roleDesc: '' }
      // },

      // 删除角色
      async delRole (id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`roles/${id}`)
          const {meta: {msg, status}} = res.data
          if (status === 200) {
            this.$message.success(msg)
            this.getRoleList()
          } else {
            this.$message.error(`${status} : ${msg}`)
          }
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
</style>
