<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      label-position="top"
      label-width="80px"
      :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password" type="password"></el-input>
      </el-form-item>
      <el-button class="login-btn" type="primary" native-type="submit" @click="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        formData: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      // 登录请求
      async handleLogin () {
        // 异步请求原代码
        // this.$http.post('login', this.formData).then((res) => {...})
        // 代码简化
        // async+await 使异步代码ajax看起来像同步代码
        // 1. 找到异步操作有结果的代码 前面家await 同时接口异步操作的结果res
        // 2. 找到距离异步操作有结果最近的方法 前面加async
        const res = await this.$http.post('login', this.formData)
        // console.log(res)
        const {
          data,
          meta: {msg, status}
        } = res.data

        if (status === 200) {
          // 登录成功
          // 0. 保存token, username
          localStorage.setItem('token', data.token)
          localStorage.setItem('username', data.username)
          // 1. 跳转home
          this.$router.push({name: 'Home'})
          // 2. 提示成功
          this.$message.success(msg)
        } else {
          // 登录失败
          // 提示错误信息
          this.$message.error(msg)
        }
      }
    }
  }
</script>

<style scoped>
  .login-wrap {
    height: 100%;
    background-color: #2f8189;
    /*弹性盒布局*/
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-wrap .login-form {
    background-color: #fff;
    width: 400px;
    padding: 30px;
    border-radius: 5px;
  }
  .login-wrap .login-btn {
    width: 100%;
  }
</style>
