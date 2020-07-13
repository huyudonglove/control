<template>
  <div>
    <div v-if="$route.name=='sdkCreate'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
         <el-page-header @back="goTo()" content="新增SDK版本" style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="isCreate">
        </el-page-header >
        <el-page-header @back="goTo()" content="编辑SDK版本" style="font-size:24px;font-weight:bold;color:#614a4d;" v-else>
        </el-page-header >
      </div>
      <div  style="margin-top:20px;width:50%">
        <el-form ref="formSize" :model="formSize" label-width="120px" :rules="rules" >
        <el-form-item label="SDK名称：" prop="name">
          <el-input v-model="formSize.name" ></el-input>
        </el-form-item>
        <el-form-item label="版本号：" prop="version">
          <el-input v-model="formSize.version" ></el-input>
        </el-form-item>
         <el-form-item label="更新日志：" prop="updateMsg">
          <el-input type="textarea" v-model="formSize.updateMsg" rows="3" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="SDK文件：" prop="sdkFileName" ref="sdkFileName">
          <el-row>
          <el-col :span="21"><el-input v-model="formSize.sdkFileName" :disabled="true"></el-input></el-col>
          <el-col :span="2"> <upComponent :accept='accept1' :type='1' @getId="getId"></upComponent></el-col>
        </el-row>
        </el-form-item>
        <el-form-item label="开发文档：" prop="sdkDocName" ref="sdkDocName">
          <el-col :span="21"><el-input v-model="formSize.sdkDocName" :disabled="true"></el-input></el-col>
          <el-col :span="2"> <upComponent :accept='accept2' :type='2' @getId="getId"></upComponent></el-col>
        </el-form-item>
        </el-form>
        <div style="width:170px;margin:0px auto">
        <el-button type="primary" @click="submitForm('formSize')">确 定</el-button>
        <el-button @click="goTo()">取 消</el-button>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import upComponent from './upComponent'
import { Base64 } from 'js-base64'
import {sdkAdd,sdkEdit,sdkInfo} from '../../http/request'
export default {
  name:'sdkCreate',
  inject:['replace','reload'],
  data(){
    return{
      formSize: {
        name: '',
        version: '',
        updateMsg: '',
        sdkFileId:'',
        sdkFileName:'',
        sdkDocId:'',
        sdkDocName:''
      },
      accept1:'.aar',
      accept2:'.pdf',
      loading:true,
      isCreate:true,
      rules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'change' },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: ['blur', 'change'] }
        ],
        version: [
        { required: true, message: '请输入版本号', trigger: 'change' },
        { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: ['blur', 'change'] }
        ],
        updateMsg:[
          { required: true, message: '请输入更新日志', trigger: 'change' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: ['blur', 'change'] }
        ],
        sdkFileName: [
          { required: true, message: '请上传SDK文件'}
        ],
        sdkDocName: [
          { required: true, message: '请上传开发文档'}
        ]
      },
    }
  },
  computed:{
  },
  watch:{
  },
  methods:{
    getId (fileId, originFileName, type) {
      if(type==1){
        this.formSize.sdkFileId=fileId;
        this.formSize.sdkFileName=originFileName
        this.$nextTick(() => {
          this.$refs.sdkFileName.clearValidate()
      })
      }else if(type==2){
        this.formSize.sdkDocId=fileId;
        this.formSize.sdkDocName=originFileName
        this.$nextTick(() => {
          this.$refs.sdkDocName.clearValidate()
      })
      }
      
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.isCreate){
            sdkAdd({...this.formSize}).then(res => {
            if (res.code) {
              this.$message.error(res.msg)
            } else {
              this.goTo()
            }
          })
          }else{
            sdkEdit({...this.formSize}).then(res => {
            if (res.code) {
              this.$message.error(res.msg)
            } else {
              this.goTo()
            }
          })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    Info(){
      sdkInfo({id:this.$route.query.id}).then(res=>{
        if(res.code){
            this.$message.error(res.msg);
          }else{
          this.loading.close();
          this.formSize = Object.assign(this.formSize,res.data);
          }
      }).catch(err=>{
        this.loading.close();
      })
    },
    goTo () {
      this.$router.go(-1)
      this.reload()
    },
     },
  created(){
    let query=this.$route.query
    if(query.id){
    this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
     this.isCreate=false
     this.Info()
    }
  },
  components: {
    upComponent
  }, 
}
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>