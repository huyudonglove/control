<template>
  <div>
    <el-upload
      ref="imgUpload"
      class="upload-demo"
      :action="'/api/file/upload'"
      :data="params"
      :headers="header"
      :show-file-list="false"
      :limit="3"
      :before-upload="beforeCallback"
      :on-progress="progress"
      :on-success="successCallback"
      :accept="accept"
      >
      <el-button style="width:100%" type="primary">选择文件</el-button>
    </el-upload>
    <el-dialog title="上传中" :visible.sync="isUpload" width="30%" :append-to-body="true" :before-close="upClose">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="percent"></el-progress>
      <span>文件正在上传中，请不要关闭页面及浏览器</span>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name:'upComponent',
  props:['accept','type'],
  data(){
    return{
      params:{
        type:'image',
        moduleCode:'background_control_file'
      },
      header:{
        Authorization:this.$cookies.get('remoteBackgroundToken')
      },
      isUpload:false,
      percent:0,
    }
  },
  methods:{
    beforeCallback(file){
     if(file.name.split('.').indexOf(this.accept.substring(1)) ==-1){
       this.$message.error(`上传文件只能是 ${this.accept}格式!`)
       return false// 判断后缀
     }
      this.isUpload = true;
    },
    progress(event){
      // console.log(event,'event')
      this.percent=parseInt(event.percent);
    },
    abortFile(){
      this.$refs.imgUpload.abort();
    },
    successCallback(response){
      this.isUpload = false;
      if(response.code){
        this.$alert(response.msg, '上传失败', {confirmButtonText: '确定'})
      }else{
          this.$alert('上传成功', {
            dangerouslyUseHTMLString: true
          });
          this.$emit('getId',response.data.fileId,response.data.originFileName,this.type)
      }
    },
    upClose(){
      // 弹窗警告
      this.$confirm('文件正在上传，离开页面将会终止上传，你确定离开吗？','警告',{
        center:true,
        confirmButtonText:'确定离开',
        cancelButtonText:'不'
        }).then(u=>{
        this.isUpload=false;
        this.abortFile();
      }).catch(r=>{
        console.log('取消')
      })
    }
  }
}
</script>
<style scoped>

</style>