<template>
  <div>
    <div v-if="$route.name=='applicationCreate'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
         <el-page-header @back="goTo()" content="新增应用" style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="isCreate">
        </el-page-header >
        <el-page-header @back="goTo()" content="编辑应用" style="font-size:24px;font-weight:bold;color:#614a4d;" v-else>
        </el-page-header >
      </div>
      <div  style="margin-top:20px;width:50%">
        <el-form ref="formSize" :model="formSize" label-width="140px" :rules="rules" >
        <el-form-item label="应用名称：" prop="name">
          <el-input v-model="formSize.name" ></el-input>
        </el-form-item>
        <el-form-item label="应用分组：" prop="typeId">
          <el-select  v-model="formSize.typeId"  style="width:100%">
            <el-option :label="item.name" :value="item.id" v-for="item in applicationType" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用Logo：" prop="logo" ref="uploadImage">
          <uploadImage :size="1" type="image" @getImg="getImg" :id="imgId" :limit="1" moduleCode="remote" ></uploadImage>
          <span style="color:#888;font-size:13px;">图片格式最大512X512，jpg，png格式</span>
        </el-form-item>
        <el-form-item label="Package name：" prop="packageName">
          <el-input v-model="formSize.packageName" ></el-input>
        </el-form-item>
        <el-form-item label="Bundle ID：" prop="bundleId">
          <el-input v-model="formSize.bundleId" ></el-input>
        </el-form-item>
        <el-form-item label="License Key：">
          <el-input v-model="licenseKey" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="支持服务：" prop="effectServiceArray">
          <el-checkbox-group v-model="formSize.effectServiceArray">
            <el-checkbox :label="item.id" name="type" v-for="item in listServiceType" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="AppKey：" >
          <el-input v-model="appKey" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="应用描述：" prop="description">
          <el-input type="textarea" v-model="formSize.description" rows="3" maxlength="200" show-word-limit></el-input>
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
import uploadImage from '../../share/uploadImage'
import { Base64 } from 'js-base64'
import {applicationType,listServiceType,applicationAdd,applicationEdit,applicationInfo} from '../../http/request'
export default {
  name:'applicationCreate',
  inject:['replace','reload'],
  data(){
    return{
      formSize: {
        typeId: '',
        logo: '',
        name: '',
        effectServiceArray:[],
        effectService:'',
        description:'',
        packageName:'',
        bundleId:''
      },
      loading:true,
      appKey: '系统自动生成',
      licenseKey:'对应SDK所需key',
      applicationType:[],
      listServiceType:[],
      imgId:'',
      isCreate:true,
      rules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'change' },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: ['blur', 'change'] }
        ],
        packageName: [
          { required: true, message: '请输入安卓应用的包名', trigger: 'change' }
        ],
        bundleId: [
          { required: true, message: '请输入苹果应用的包名', trigger: 'change' },
        ],
        typeId: [
          { required: true, message: '请选择应用分组', trigger: 'change' }
        ],
        effectServiceArray: [
          { required: true, message: '请至少选择一个支持服务', trigger: 'change' }
        ],
        logo: [
          { required: true, message: '请上传应用Logo'}
        ]
      },
    }
  },
  computed:{
    effectServiceArray(){
      return this.formSize.effectServiceArray
    }
  },
  watch:{
    effectServiceArray(){
      this.formSize.effectServiceArray.length?this.formSize.effectService=this.effectServiceArray.join(','):this.formSize.effectService=''
    }
  },
  methods:{
    applicationTypeList(){
      applicationType({}).then(res=>{
        this.applicationType=res.data;
      })
    },
    listServiceTypeList(){
      listServiceType({}).then(res=>{
        this.listServiceType=res.data;
      })
    },
    getImg (fileId, originFileName, size, type) {
      this.formSize.logo = fileId
      this.$nextTick(() => {
        this.$refs.uploadImage.clearValidate()
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.isCreate){
            applicationAdd({...this.formSize}).then(res => {
            if (res.code) {
              this.$message.error(res.msg)
            } else {
              this.goTo()
            }
          })
          }else{
            applicationEdit({...this.formSize}).then(res => {
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
      applicationInfo({id:this.$route.query.id}).then(res=>{
        if(res.code){
            this.$message.error(res.msg);
          }else{
          this.loading.close();
          this.formSize = Object.assign(this.formSize,res.data);
          this.imgId = `/static/${Base64.decode(res.data.logo)}`
          this.appKey=this.formSize.appKey
          this.licenseKey=this.formSize.licenseKey
          this.formSize.effectServiceArray=this.formSize.effectService.split(',')
          this.formSize.effectServiceArray=this.formSize.effectServiceArray.map(Number)
          }
      }).catch(err=>{
        this.loading.close();
      })
    },
    goTo () {
      this.$router.push({path: '/serviceManage/applicationList', query: JSON.parse(this.$route.query.msg)})
      this.reload()
    },
     },
  created(){
    this.applicationTypeList();
    this.listServiceTypeList();
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
    uploadImage
  }, 
}
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>