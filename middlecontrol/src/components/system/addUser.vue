<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">添加用户</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑用户</span>
    </div>
    <div>
      <el-card class="box-card"  style="margin-bottom:10px;">
        <div slot="header" class="clearfix">
          <span style="font-size:20px;">基本信息</span>
        </div>
        <el-form ref="form" label-position="right" label-width="150px" :model="form" :rules="rules" style="width: 70%">
          <el-form-item label="用户名称" prop="userName" :required="true">
            <el-input type="text" v-model="form.userName" maxlength="50" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="邮箱账号" prop="email" :required="true">
            <el-input :disabled="isEdit" type="text" v-model="form.email" maxlength="50" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone" :required="true">
            <el-input :disabled="isEdit" type="text" v-model="form.phone" maxlength="50" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleCode" :required="true">
            <!-- <el-select v-model="form.roleCodeArr" multiple placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.roleCode">
              </el-option>
            </el-select> -->
            <el-select v-model="form.roleCode" style="width:150px;">
              <el-option v-for="(item,idx) in roleList" :key="idx" :label="item.roleName" :value="item.roleCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <span style="color:red">注：用户可使用手机号或邮箱作为登录帐号，默认密码为：邮箱+123</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addOrEdit">确定</el-button>
            <el-button @click="$router.go(-1);">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import {addSystemUser,editSystemUser,getSystemUserInfo,roleDropDown} from '../../http/request'
export default {
  name:'addUser',
  inject:['replace'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      roleList:[],
      form:{
        userName:'',
        email:'',
        phone:'',
        roleCode:''
      },
      rules:{
        userName:[{required: true, message: '请输入用户名称', trigger: 'change'},{required: true, message: '请输入用户名称', trigger: 'blur'}],
        roleCode:[{required: true, message: '请选择角色', trigger: 'change'},{required: true, message: '请选择角色', trigger: 'blur'}],
        phone:[
          {required: true, message: '请输入手机号', trigger: 'change'},
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
        ],
        email:[
          {required: true, message: '请输入邮箱', trigger: 'change'},
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, message: '邮箱格式不正确', trigger: 'blur'}
        ],
      },
    }
  },
  methods:{
    dropDown(){//角色下拉框
      roleDropDown().then(res=>{
        this.roleList = res.data;
      })
    },
    userInfo(){
      getSystemUserInfo({"id":parseInt(this.$route.query.id)}).then(res=>{
        this.form.userName = res.data.userName;
        this.form.phone = res.data.phone;
        this.form.email = res.data.email;
        this.form.roleCode = res.data.roleCode
      })
    },
    addOrEdit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.isCreate){
            addSystemUser({
              "userName":this.form.userName,
              "phone":this.form.phone,
              "email":this.form.email,
              "roleCode":this.form.roleCode
            }).then(res=>{
              this.$router.go(-1);
            })
          }else if(this.isEdit){
            editSystemUser({
              "id":parseInt(this.$route.query.id),
              "userName":this.form.userName,
              "roleCode":this.form.roleCode
            }).then(res=>{
              this.$router.go(-1);
            })
          } 
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
  created(){
    this.dropDown();
    if(this.$route.query.id){
      this.isEdit=true;
      this.userInfo();
    }else{
      this.isCreate=true;
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