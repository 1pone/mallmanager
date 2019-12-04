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
      <el-row style="margin-bottom: 20px">
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
          v-loading="loadingTable"
          stripe
          ref="table"
          height="500"
          style="width: 100%; margin-bottom: 20px">
          <el-table-column
            type="expand"
            width="1">
            <template slot-scope="scope">
              <el-row v-for="(item1, i) in scope.row.children" :key="i" :class="['borderBottom', i === 0 ? 'borderTop' : '']">
                <el-col :span="6" style="min-width: 110px">
<!--                  一级权限标签-->
                  <el-tag closable @close="DelRight(scope,item1.id)">{{item1.authName}}</el-tag><i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-row v-for="(item2, j) in item1.children" :key="j" :class="j === 0 ? '' : 'borderTop'">
                    <el-col :span="8" style="min-width: 110px">
<!--                      二级权限标签-->
                      <el-tag type="success" closable @close="DelRight(scope,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <el-col :span="16" style="min-width: 200px">
<!--                      三级权限标签-->
                      <el-tag type="warning"
                              closable v-for="(item3, k) in item2.children"
                              :key="k"
                              @close="DelRight(scope,item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
<!--          无权限提示-->
              <span v-if="scope.row.children.length === 0" style="display: block;text-align: center;color: #909399">未分配权限</span>
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
              <el-button type="success" icon="el-icon-info" size="small" circle @click="toogleExpand(scope.row)"></el-button>
              <el-button type="warning" icon="el-icon-setting" size="small" circle @click="getRightList(scope.row)"></el-button>
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
<!--      分配权限-->
      <el-dialog title="分配权限" :visible.sync="dialogRightVisible" @close="dialogRightClose">
        <el-tree
          :data="rightList"
          v-loading="loadingTree"
          show-checkbox
          default-expand-all
          :default-checked-keys="arrChecked"
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRightClose">取 消</el-button>
          <el-button type="primary" @click="editRight">确 定</el-button>
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
        dialogRightVisible: false,
        loadingTable: false,
        loadingTree: false,
        formLabelWidth: '120px',
        roleList: [],
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
        },
        // 权限分配
        rightList: [],
        arrChecked: [],
        roleChecked: {},
        defaultProps: {
          children: 'children',
          label: 'authName'
        }
      }
    },
    mounted () {
      this.getRoleList()
    },
    methods: {
      // 获取角色列表
      async getRoleList () {
        this.loadingTable = true
        const res = await this.$http.get('roles')
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.loadingTable = false
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

      // 获取权限列表
      async getRightList (role) {
        this.dialogRightVisible = true
        this.loadingTree = true
        this.roleChecked.id = role.id
        const res = await this.$http.get(`rights/tree`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.rightList = res.data.data
          let arrTemp = []
          role.children.forEach(item1 => {
            // arrTemp.push(item1.id)
            item1.children.forEach(item2 => {
              // arrTemp.push(item2.id)
              item2.children.forEach(item3 => {
                arrTemp.push(item3.id)
              })
            })
          })
          this.arrChecked = arrTemp
          this.loadingTree = false
          // this.$message.success(msg)
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 关闭权限分配对话框
      dialogRightClose () {
        this.dialogRightVisible = false
        this.arrChecked = []
        this.roleChecked = {}
      },

      // 提交角色新权限
      async editRight () {
        this.arrChecked = this.$refs.tree.getCheckedKeys()
        this.arrChecked.push(...this.$refs.tree.getHalfCheckedKeys())
        const res = await this.$http.post(`roles/${this.roleChecked.id}/rights`, {rids: this.arrChecked.join(',')})
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.getRoleList()
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
        this.dialogRightClose()
      },

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
      },

      // 删除角色权限
      async DelRight (scope, rightId) {
        console.log(scope)
        const res = await this.$http.delete(`roles/${scope.row.id}/rights/${rightId}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.roleList[scope.$index].children = res.data.data // 后台返回该角色剩余权限信息，直接赋值给roleList动态渲染表格
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 行展开 手风琴效果
      toogleExpand (row) {
        let $table = this.$refs.table
        this.roleList.map((item) => { // 遍历并关闭所有非当前展开行
          if (row.id !== item.id) {
            $table.toggleRowExpansion(item, false)
          }
        })
        $table.toggleRowExpansion(row)
      }
    }
  }
</script>

<style scoped>
  .borderBottom {
    border-bottom: 1px solid #ddd
  }

  .borderTop {
    border-top: 1px solid #ddd
  }

  .el-tag {
    margin: 5px 5px
  }
</style>
