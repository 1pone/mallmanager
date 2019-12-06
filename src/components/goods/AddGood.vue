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
        <el-row>
          <el-steps :space="200" :active="active*1" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
          </el-steps>
        </el-row>
        <el-row>
          <el-form label-position="top" label-width="80px" :model="form" style="padding-right: 100px">
            <el-tabs v-model="active" tab-position="left" @tab-click="tabChange" style="height: auto;">
              <el-tab-pane name='0' label="基本信息">
                <el-form-item label="商品名称">
                  <el-input v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                  <el-input v-model="form.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                  <el-input v-model="form.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                  <el-input v-model="form.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品商品分类">
<!--                  级联选择器-->
                  <el-cascader
                    v-model="selectedOptions"
                    :options="options"
                    :props="defaultProp"
                    filterable></el-cascader>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name='1' label="商品参数">
                <el-form-item :label="item1.attr_name" v-for="(item1, index1) in arrDyparams" :key="index1">
                  <el-checkbox-group v-model="item1.attr_vals">
                    <el-checkbox :label="item2" v-for="(item2,index2) in item1.attr_vals" :key="index2" border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name='2' label="商品属性">
                <el-form-item :label="item.attr_name" v-for="(item, i) in arrStparams" :key="i">
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name='3' label="商品图片">
                <el-form-item>
                  <el-upload
                    :headers="header"
                    action="http://localhost:8888/api/private/v1/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name='4' label="商品内容">
                <el-form-item>
                  <quillEditor v-model="form.goods_introduce"></quillEditor>
                  <el-button type="primary" style="margin-top: 20px" @click="addGoods">添加商品</el-button>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-row>
      </el-card>
    </div>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import { quillEditor } from 'vue-quill-editor'
  export default {
    name: 'AddGood',
    components: {
      quillEditor
    },
    data () {
      return {
        active: 0,
        // 添加商品数据
        // goods_name 商品名称 不能为空
        // goods_cat 以为','分割的分类列表 不能为空
        // goods_price 价格 不能为空
        // goods_number 数量 不能为空
        // goods_weight 重量 不能为空
        // goods_introduce 介绍 可以为空
        // pics 上传的图片临时路径（对象）可以为空
        // attrs 商品的参数（数组）可以为空
        form: {
          goods_name: '',
          goods_cat: [],
          goods_price: null,
          goods_number: null,
          goods_weight: null,
          goods_introduce: '',
          pics: [],
          attrs: []
        },
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
        // 动态参数的数据列表
        arrDyparams: [],
        // 静态参数的数据列表
        arrStparams: [],
        // 图片上传
        fileList: {},
        // 头部信息
        header: {
          Authorization: localStorage.getItem('token')
        }
      }
    },
    computed: {
      attrs () {
        let attrs = []
        this.arrDyparams.forEach(item => {
          item.attr_vals.forEach(val => {
            attrs.push({attr_id: item.attr_id, attr_value: val})
          })
        })
        this.arrStparams.forEach(item => {
          attrs.push({attr_id: item.attr_id, attr_value: item.attr_vals})
        })
        console.log(attrs)
        return attrs
      }
    },
    mounted () {
      this.getCategories()
    },
    methods: {
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
      async tabChange () {
        if (this.active === '1') {
          if (this.selectedOptions.length === 0) {
            this.$message.error('请选择商品分类')
          } else {
            const res = await this.$http.get(`categories/${this.selectedOptions[this.selectedOptions.length - 1]}/attributes?sel=many`)
            const {meta: {msg, status}} = res.data
            if (status === 200) {
              this.arrDyparams = res.data.data
              this.arrDyparams.forEach(item => {
                item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
              })
            } else {
              this.$message.error(`${status} : ${msg}`)
            }
          }
        } else if (this.active === '2') {
          if (this.selectedOptions.length === 0) {
            this.$message.error('请选择商品分类')
          } else {
            const res = await this.$http.get(`categories/${this.selectedOptions[this.selectedOptions.length - 1]}/attributes?sel=only`)
            const {meta: {msg, status}} = res.data
            if (status === 200) {
              this.arrStparams = res.data.data
            } else {
              this.$message.error(`${status} : ${msg}`)
            }
          }
        }
      },

      // 添加商品
      async addGoods () {
        // 发送请求前处理this.form未处理的数据
        // good_cat -> 分类
        this.form.goods_cat = this.selectedOptions.join(',')
        // attr -> 商品的参数
        this.form.attrs = this.attrs
        const res = await this.$http.post('goods', this.form)
        const {meta: {msg, status}} = res.data
        if (status === 201) {
          this.$message.success(msg)
          await this.$router.push({name: 'GoodsList'})
        } else {
          this.$message.error(`error ${status} : ${msg}`)
        }
      },

      // 图片上传用到的方法:
      // pics -> 上传的图片临时路径（对象）
      handlePreview (file) {
        console.log('预览', file)
      },
      handleRemove (file) {
        // console.log('移除', file)
        // findIndex() 数组自带方法，返回符合条件元素的索引值
        let index = this.form.pics.findIndex((item) => {
          return item.pic === file.response.data.tmp_path
        })
        this.form.pics.splice(index, 1) // 移除数组元素
        console.log(this.form.pics)
      },
      handleSuccess (file) {
        // console.log('成功', file)
        this.form.pics.push({
          pic: file.data.tmp_path
        })
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .editor .ql-editor{
    min-height: 200px;
  }
  .ql-editor {
    height: 400px;
  }
</style>
