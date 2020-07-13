<template>
  <div v-if="pswPower.length">
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">修改密码</span>
    </div>
    <div>
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="登录密码" prop="oldPassword" required>
          <input  type="text"  class="is-hidden" />
          <el-input type="password" v-model="form.oldPassword" style="width:200px;" autocomplete="new-password" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password" required>
          <input  type="text"  class="is-hidden" />
          <el-input type="password" v-model="form.password" style="width:200px;" autocomplete="new-password" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" required>
          <input  type="text"  class="is-hidden" />
          <el-input type="password" v-model="form.confirmPassword" style="width:200px;" autocomplete="new-password" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="">
          <span style="color:red">注：密码必须为6-16位字母+数字的组合</span>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="!pswPower[1].isCheck" type="primary" @click="confirm">确定</el-button>
          <el-button @click="$router.push({path:'/firstPage'})">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {editPassword} from '../../http/request'
import { mapState } from "vuex";
export default {
  name: 'modifyPassword',
  data () {
    return {
      form: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{required: true, message: '请输入登录密码', trigger: 'change'},{required: true, message: '请输入登录密码', trigger: 'blur'}],
        password: [
          {required: true, message: '请输入新密码', trigger: 'change'},
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9]{6,16}$/, message: '密码必须为6-16位字母+数字的组合', trigger: 'blur'}
        ],
        confirmPassword: [
          {validator: this.validatePass, trigger: 'change'},
          {validator: this.validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  computed:{
    ...mapState('currentUserPower',{pswPower:'pswPower'}),
  },
  methods: {
    validatePass (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          editPassword({...this.form}).then(res => {
            this.$router.push('/logout')
          }).catch(err => {

          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.is-hidden {
    position: absolute;
    left: -10000px;
    top: -10000px;
}
</style>
