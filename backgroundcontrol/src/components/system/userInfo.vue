<template>
  <div>
    <div v-if="$route.name=='userInfo'">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
          <el-button style="float: right;" type="primary" size="mini" @click="$router.push({path:'/userInfo/editInfo',query:{Info:JSON.stringify(form)}})">编辑基本信息</el-button>
        </div>
        <div class="text item">
          <el-avatar style="margin-left:30px;" :size="150" :src="require('../../assets/headPhoto.jpg')"></el-avatar>
          <div style="margin-left:20px;display:inline-block;vertical-align:top;">
            <el-form :inline="true" label-width="140px">
              <el-form-item label="用户名称：">
                <span>{{form.userName}}</span>
              </el-form-item>
              <el-form-item label="性别：">
                <span>{{form.sex==1?'男':'女'}}</span>
              </el-form-item>
              <el-form-item label="所属单位：">
                <span>{{form.departmentName}}</span>
              </el-form-item>
            </el-form>
            <el-form :inline="true" label-width="140px">
              <el-form-item label="用户组：">
                <span>{{form.userGroupName}}</span>
              </el-form-item>
              <el-form-item label="手机号：">
                <span>{{form.phone}}</span>
              </el-form-item>
              <el-form-item label="邮箱：">
                <span>{{form.email}}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import {getBasicInfo} from '../../http/request'
export default {
  name:'userInfo',
  data(){
    return{
      form:{
        id:'',
        userName:'',
        sex:'',
        userGroupId:'',
        userGroupName:'',
        departmentId:'',
        departmentName:'',
        phone:'',
        email:'',
      }, 
    }
  },
  methods: {
    getInfo () {
      getBasicInfo().then(res => {
        if (res.code) {
          this.$message.error(res.msg)
        } else {
          this.form.id = res.data.id
          this.form.userName = res.data.userName
          this.form.sex = res.data.sex
          this.form.userGroupId = res.data.userGroupId
          this.form.userGroupName = res.data.userGroupName
          this.form.departmentId = res.data.departmentId
          this.form.departmentName = res.data.departmentName
          this.form.phone = res.data.phone
          this.form.email = res.data.email
        }
      })
    }
  },
  created () {
    this.getInfo()
  }
}
</script>
<style scoped>

</style>
