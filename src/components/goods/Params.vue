<template>
  <div>
    <el-row>
      <!--      1. 面包屑-->
      <!--      1.1 首页 > 用户管理 > 用户列表-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--    卡片容器-->
    <el-card class="box-card" shadow="always">
      <el-row>
        <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning"
          :closable="false"
          center
          show-icon>
        </el-alert>
      </el-row>
      <el-row>
        <el-form ref="form" label-width="120px">
          <el-form-item label="选择商品分类：">
            <!--                  级联选择器-->
            <el-cascader
              v-model="selectedOptions"
              :options="options"
              :props="defaultProp"
              @change="getAttrs"
              filterable>
            </el-cascader>
            <el-button
              type="primary"
              style="margin-bottom: 10px;float: right"
              @click="dialogEditVisible = true"
              :disabled="addAttrDisabled">添加参数</el-button>
          </el-form-item>
        </el-form>
        <el-tabs v-model="active" type="card">
          <el-tab-pane label="动态参数">
<!--            展开行-->
            <el-table
              :data="arrDyparams"
              v-loading="loading"
              ref="tableDy"
              height="500"
              stripe
              style="width: 100%;overflow: auto">
              <el-table-column
                type="expand"
                width="1px">
                <template slot-scope="scope">
<!--                  展开行属性标签-->
                  <el-tag
                    :key="index"
                    v-for="(tag, index) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scope.row, index)"
                    style="margin: 4px">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput" style="margin: 4px">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                label="#"
                align="center"
                width="40px">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称"
                align="center"
                min-width="200px">
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                min-width="120px">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="small" circle @click="editAttrs(JSON.parse(JSON.stringify(scope.row)))"></el-button>
                  <el-button type="success" icon="el-icon-info" size="small" circle @click="toogleExpandDy(scope.row)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="small" circle @click="delAttrs(scope.row.cat_id, scope.row.attr_id)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态参数">
            <el-table
              :data="arrStparams"
              v-loading="loading"
              ref="tableSt"
              height="500"
              stripe
              style="width: 100%;overflow: auto">
              <el-table-column
                type="expand"
                width="1px">
                <template slot-scope="scope">
<!--                  展开行属性标签-->
                  <el-tag
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scope.row)"
                    v-if="scope.row.attr_vals !== ''"
                    style="margin: 4px">
                    {{scope.row.attr_vals}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput" style="margin: 4px">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                label="#"
                align="center"
                width="40px">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称"
                align="center"
                min-width="200px">
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                min-width="120px">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="small" circle @click="editAttrs(JSON.parse(JSON.stringify(scope.row)))"></el-button>
                  <el-button type="success" icon="el-icon-info" size="small" circle @click="toogleExpandSt(scope.row)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="small" circle @click="delAttrs(scope.row.cat_id, scope.row.attr_id)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
    <!--      修改参数属性表单-->
    <el-dialog :title="attrKind[active]" :visible.sync="dialogEditVisible" @close="dialogClose('editForm')">
      <el-form :model="selectedAttrs" ref="editForm" label-width="120px" status-icon>
        <el-form-item label="参数名称">
          <el-input v-model="selectedAttrs.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
<!--        编辑参数和新建参数共用selectedAttrs，新建时selectedAttrs只有一个attr_name对象，通过判断selectedAttrs大小选择方法-->
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Params',
    data () {
      return {
        loading: false,
        inputVisible: false,
        inputValue: '',
        // 级联选择器绑定的数据
        selectedOptions: [], // 选中的数据
        options: [], // 选择器的数据源
        // 级联选择器配置选项
        defaultProp: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
          expandTrigger: 'hover'
        },
        // 当前标签页index
        active: '0',
        attrKind: ['修改动态参数', '修改静态参数'],
        dialogEditVisible: false,
        selectedAttrs: {},
        // 商品参数
        arrDyparams: [],
        arrStparams: []
      }
    },
    mounted () {
      this.getCategories()
    },
    computed: {
      addAttrDisabled () {
        return this.selectedOptions.length !== 3
      }
    },
    methods: {
      // 获取级联选择器数据——商品分类
      async getCategories () {
        const res = await this.$http.get(`categories?type=3`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          // this.$message.success(msg)
          const data = res.data.data
          this.options = data
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 获取动态参数和静态参数
      getAttrs () {
        this.getAttrDy()
        this.getAttrSt()
      },

      // 获取动态参数
      async getAttrDy () {
        this.loading = true
        const res = await this.$http.get(`categories/${this.selectedOptions[this.selectedOptions.length - 1]}/attributes?sel=many`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.loading = false
          this.arrDyparams = res.data.data
          // console.log(res.data.data)
          this.arrDyparams.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
          })
          // console.log(this.arrDyparams)
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 获取静态参数
      async getAttrSt () {
        this.loading = true
        const res = await this.$http.get(`categories/${this.selectedOptions[this.selectedOptions.length - 1]}/attributes?sel=only`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.loading = false
          this.arrStparams = res.data.data
          console.log(res.data.data)
          // TODO 静态参数attr_vals应该为字符串对象
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
      },

      // 添加动态参数
      async addAttr () {
        var catId = this.selectedOptions[this.selectedOptions.length - 1]
        var attrSel = this.active === '0' ? 'many' : 'only'
        var param = {
          attr_name: this.selectedAttrs.attr_name,
          attr_sel: attrSel
        }
        const res = await this.$http.post(`categories/${catId}/attributes`, param)
        const {meta: {msg, status}} = res.data
        if (status === 201) {
          this.$message.success(msg)
          this.getAttrs()
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
        this.dialogClose()
      },

      // 修改参数名称
      editAttrs (row) {
        this.dialogEditVisible = true
        this.selectedAttrs = row
      },

      // 对话框确认
      dialogConfirm () {
        Object.keys(this.selectedAttrs).length > 1 ? this.putAttrs(this.selectedAttrs) : this.addAttr()
      },

      // 关闭对话框
      dialogClose () {
        this.dialogEditVisible = false
        this.selectedAttrs = {}
      },

      // 属性标签关闭,删除动态属性参数
      handleClose (row, index) {
        row.attr_vals.splice(index, 1)
        this.putAttrs(row)
      },

      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      // 属性标签确认,提交动态属性参数
      handleInputConfirm (row) {
        let inputValue = this.inputValue
        if (inputValue) {
          if (this.active === '0') {
            // 处于动态属性标签页，新标签加入row.attr_vals数组
            row.attr_vals.push(inputValue)
            this.putAttrs(row)
          } else {
            // 处于静态属性标签页，row.attr_vals为字符串对象，新标签赋值row.attr_vals
            row.attr_vals = inputValue
            this.putAttrs(row)
          }
        }
        this.inputVisible = false
        this.inputValue = ''
      },

      // 编辑提交参数
      async putAttrs (row) {
        // 动态参数，将参数值由数组改为以','分隔的字符串
        var attrs = JSON.parse(JSON.stringify(row))
        if (row.attr_sel === 'many') {
          attrs.attr_vals = row.attr_vals.join(',')
        }
        const res = await this.$http.put(`categories/${attrs.cat_id}/attributes/${attrs.attr_id}`, attrs)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          // TODO 前段数据同步（目前除了编辑参数名称外其他编辑操作可不用重新获取参数列表）
          this.getAttrs()
        } else {
          this.$message.error(`${status} : ${msg}`)
        }
        this.dialogClose()
      },

      // 删除参数
      delAttrs (catId, attrId) {
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`categories/${catId}/attributes/${attrId}`)
          const {meta: {msg, status}} = res.data
          if (status === 200) {
            this.$message.success(msg)
            this.getAttrs()
          } else {
            this.$message.error(`${status} : ${msg}`)
          }
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },

      // 行展开 手风琴效果
      toogleExpandDy (row) {
        let $table = this.$refs.tableDy
        this.arrDyparams.map((item) => { // 遍历并关闭所有非当前展开行
          if (row.attr_id !== item.attr_id) {
            $table.toggleRowExpansion(item, false)
          }
        })
        $table.toggleRowExpansion(row)
      },

      toogleExpandSt (row) {
        let $table = this.$refs.tableSt
        this.arrStparams.map((item) => { // 遍历并关闭所有非当前展开行
          if (row.attr_id !== item.attr_id) {
            $table.toggleRowExpansion(item, false)
          }
        })
        $table.toggleRowExpansion(row)
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .el-form-item {
    margin-top: -2px;
    margin-bottom: 8px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .input-new-tag {
    margin: 4px;
  }
</style>
