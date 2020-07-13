<template>
  <div style="position:relative;">
    <div style="position:absolute;left:10px;top:10px;z-index:100;color:red;">{{power?power+'%':'/'}}</div>
    <div style="position:absolute;right:10px;top:10px;z-index:100;color:red;">{{equipName?equipName:''}}</div>
    <videoPlayer class="vjs-custom-skin videoPlayer" :options="playerOptions"></videoPlayer>
  </div>
</template>

<script>
  import 'video.js/dist/video-js.css'
  import {videoPlayer} from 'vue-video-player'
  import 'videojs-flash'
  import {getEquipInfo} from '../http/request'
  export default {
    components: {
      videoPlayer,
    },
    data() {
      return {
        power:'',
        equipName:'',
        mySetIntervalPower:null,
        // playerOptions: {
        //   sources: [{
        //     type: "rtmp/mp4",
        //     src: "rtmp://58.200.131.2:1935/livetv/hunantv"
        //   }],
        //   techOrder: ['flash'],
        //   autoplay: true,
        //   fluid: true,
        //   controlBar: {
        //     timeDivider: true,
        //     durationDisplay: true,
        //     remainingTimeDisplay: false,
        //     fullscreenToggle: true  //全屏按钮
        //   }
        // }
      }
    },
    computed:{
      playerOptions(){
        return {
          sources: [{
            type: "rtmp/mp4",
            src: this.$route.query.rtmpUrl
          }],
          techOrder: ['flash'],
          autoplay: true,
          fluid: true,
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        }
      }
    },
    methods:{
      getPower(){
        getEquipInfo({"id":parseInt(this.$route.query.id)}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{  
            this.power = res.data.power;
            this.equipName = res.data.equipmentName;
          }
        })
      }
    },
    created(){
      this.getPower();
      this.mySetIntervalPower = setInterval(this.getPower,30000);
    },
    destroyed(){
      clearInterval(this.mySetIntervalPower);
    },
  }
</script>

<style scoped>
  .video-js .vjs-icon-placeholder {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
