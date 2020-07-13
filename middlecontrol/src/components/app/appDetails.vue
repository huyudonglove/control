<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <el-page-header @back="$router.go(-1)" content="应用详情" style="font-size:24px;font-weight:bold;color:#614a4d;"></el-page-header>
    </div>
    <el-form ref="formData" :model="formData" label-width="130px">
      <el-form-item label="应用名称：">
        {{formData.name}}
      </el-form-item>
      <el-form-item label="应用分类：">
        <span v-if="formData.typeId==1">游戏类</span>
        <span v-if="formData.typeId==2">应用类</span>
      </el-form-item>
      <el-form-item label="应用简介：">
        <div style="white-space:pre-wrap;">{{formData.description?formData.description:'无'}}</div>
      </el-form-item>
      <el-form-item label="Package Name：">
        {{formData.packageName?formData.packageName:'无'}}
      </el-form-item>
      <el-form-item label="Bundel ID：">
        {{formData.bundleId?formData.bundleId:'无'}}
      </el-form-item>
      <el-form-item label="License Key：">
        <div style="word-wrap: break-word;"><span ref="licenseKey">{{formData.licenseKey?formData.licenseKey:'无'}}</span> <el-button v-if="formData.licenseKey" type="text" @click="copy('licenseKey')">复制</el-button></div>
      </el-form-item>
      <el-form-item label="APP Key：">
        <div style="word-wrap: break-word;"><span ref="appKey">{{formData.appKey?formData.appKey:'无'}}</span> <el-button v-if="formData.appKey" type="text" @click="copy('appKey')">复制</el-button></div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name:'appDetails',
  data(){
    return{
      formData:{
        name:'',
        typeId:'',
        description:'',
        packageName:'',
        bundleId:'',
        licenseKey:'',
        appKey:''
      },
    }
  },
  methods:{
    copy(ref){
      window.getSelection().removeAllRanges();
      var r = document.createRange(); 
      r.selectNode(this.$refs[ref]); 
      window.getSelection().addRange(r); 
      document.execCommand("Copy");
      window.getSelection().removeAllRanges();
      this.$message({
        message: '复制成功',
        duration: 500,
        type: 'success'
      })
    },
  },
  created(){
    let paramsData = JSON.parse(this.$route.query.myData);
    this.formData.name = paramsData.name;
    this.formData.typeId = paramsData.typeId;
    this.formData.description = paramsData.description;
    this.formData.packageName = paramsData.packageName;
    this.formData.bundleId = paramsData.bundleId;
    this.formData.licenseKey = paramsData.licenseKey;
    this.formData.appKey = paramsData.appKey;
  }
}
</script>
<style scoped>

</style>