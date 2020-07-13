<template>
    <div>
      <el-upload
        class="avatar-uploader"
        :action="`/api/file/upload`"
        :data="msg"
        :headers="header"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
         ref="images"
        >
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
</template>

<script>
export default {
  name: 'uploadImg',
  props: ['size', 'type', 'id', 'limit', 'moduleCode'],
  data () {
    return {
      imageUrl: '',
      msg: {
      },
      header: {
        Authorization: this.$cookies.get('remoteBackgroundToken')
      }
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      if (res.code) {
        this.$message.error(res.msg)
        return
      }
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$emit('getImg', res.data.fileId, res.data.originFileName, res.data.size, this.type)
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < (this.size * 1)
      const isPNG = file.type == 'image/jpeg' || file.type == 'image/png'
      if (!isPNG) {
        this.$message.error('上传头像图片只能是 JPG或者PNG 格式!')
        return false// 判断jpg/png
      }
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过 ${this.size}MB!`)
        return false// 判断size
      }
      const isSize = new Promise(function(resolve, reject) {
      let width = 512;
      let height = 512;
      let _URL = window.URL || window.webkitURL;         
      let img = new Image();
      img.onload = function() {
          let valid = img.width <= width && img.height <= height;
          valid ? resolve() : reject();
      }
          img.src = _URL.createObjectURL(file);
      }).then(() => {
          return file;
      }, () => {
          this.$message.error('上传的图片不能大于512x512!');
          return Promise.reject();
      });
      return  isSize;
    }
    
  },
  watch: {
    id () {
      this.id ? (() => {
        this.imageUrl = this.id
      })() : (() => {
        this.imageUrl = ''
      })()
    }
  },
  mounted () {
    this.msg.type = this.type
    this.msg.moduleCode = this.moduleCode
    this.id ? (() => {
      this.imageUrl = this.id
    })() : (() => {
      this.imageUrl = ''
    })()
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
