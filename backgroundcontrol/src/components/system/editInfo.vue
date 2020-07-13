<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">编辑资料</span>
    </div>
    <div>
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="用户名称：" prop="userName" required>
          <el-input type="text" v-model="form.userName" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="所属单位：" prop="departmentName" required>
          <el-input v-model="form.departmentName" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="用户组：" prop="userGroupName">
          <el-input v-model="form.userGroupName" disabled style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex" required>
          <span class="myWords">
            <el-select v-model="form.sex" style="width:150px;">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </span>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone" required>
          <el-input type="text" disabled v-model="form.phone" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email" required>
          <el-input type="text" disabled v-model="form.email" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit">确定</el-button>
          <el-button @click="$router.go(-1);">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {editInfomation} from '../../http/request'
export default {
  name: 'editInfo',
  inject: ['reload'],
  data () {
    return {
      form: {
        id: '',
        userName: '',
        userGroupId:'',
        userGroupName: '',
        departmentId: '',
        departmentName: '',
        sex: 1,
        phone: '',
        email: ''
      },
      rules: {
        userName: [{required: true, message: '请输入用户名称', trigger: 'change'},{required: true, message: '请输入用户名称', trigger: 'blur'}],
        departmentName: [{required: true, message: '请输入所属单位', trigger: 'change'},{required: true, message: '请输入所属单位', trigger: 'blur'}]
      }
    }
  },
  methods: {
    edit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          editInfomation({'id': this.form.id, 'userName': this.form.userName, 'departmentId': this.form.departmentId, 'departmentName': this.form.departmentName, 'sex': this.form.sex}).then(res => {
            this.$router.push({path: '/userInfo'})
            this.reload()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created () {
    if (this.$route.query.Info) {
      this.form = JSON.parse(this.$route.query.Info)
    }
  }
}
</script>
<style scoped>

</style>
