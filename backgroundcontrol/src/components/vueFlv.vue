<template>
  <div style="padding: 50px">
    <div style="position:relative;" class="centeredVideo" ref="myDiv">
      <div style="position:absolute;left:10px;top:10px;z-index:100;color:red;">{{equipCode?equipCode:''}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{equipmentName?equipmentName:''}}</div>
      <div style="position:absolute;right:10px;top:10px;z-index:100;color:red;">{{power?power+'%':'/'}}</div>
      <video id="videoElement" class="centeredVideo" autoplay muted ref="player"></video>
    </div>
    <div style="text-align: center;margin-top: 10px">
        <el-button @click="full()" size="mini">全屏</el-button>
    </div>
  </div>
</template>

<script>
import flvjs from "../../static/flv.js";
import { getEquipInfo } from "../http/request";
export default {
  name: "vueFlv",
  data() {
    return {
      screen_width: 0,
      screen_height: 0,
      video_width: 0,
      video_height: 0,
      x: 0,
      y: 0,
      new_x: 0,
      new_y: 0,
      videoUrl: "http://10.5.28.249:9080/live?port=1935&app=utplive4k&stream=utpa360pro3",
      player: null,
      str: "",
      control: true,
      num: 0,
      end: false,
      id: "",
      controlAble: false,
      loading: false,
      equipmentName: "",
      power: "",
      equipCode:'',
      myDiv:false,
    };
  },
  methods: {
    requestFullScreen(element) {
      var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
      if (requestMethod) {
        requestMethod.call(element);
      } else if (typeof window.ActiveXObject !== "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    full() {
      this.requestFullScreen(this.$refs.player);
      this.myDiv=true;

    },
    getPower(){
      getEquipInfo({"id":parseInt(this.$route.query.id)}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.power = res.data.power;
          this.equipmentName = res.data.equipmentName;
          this.equipCode = res.data.code
        }
      })
    }
  },
  mounted() {
    console.log(this.$route.query.rtmpUrl);
    console.log(JSON.parse(this.$route.query.rtmpUrl));
    if (flvjs.isSupported()) {
      let video = this.$refs.player;
      if (video) {
        this.player = flvjs.createPlayer({
          type: "flv",
          hasAudio: false,
          isLive: true,
          url: JSON.parse(this.$route.query.rtmpUrl).join('&')
        });
        this.player.attachMediaElement(video);
        try {
          this.player.load();
          this.player.play();
          //console.log(flvjs,777)
        } catch (error) {
          console.log(error);
        }
      }
    }
  },
  created(){
    this.getPower();
    this.mySetIntervalPower = setInterval(this.getPower,30000);
  },
  destroyed(){
    clearInterval(this.mySetIntervalPower);
  },
};
</script>

<style scoped>

.centeredVideo {
  display: block;
  width: 900px;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: auto;
  border: 1px solid #ddd;
}

video::-webkit-media-controls-fullscreen-button{ display: none !important; }

/*video默认aduio音量按钮*/
video::-webkit-media-controls-mute-button { display: none !important;}

/*video默认setting按钮*/
video::-internal-media-controls-overflow-button{ display: none !important;}

/*腾讯云点播禁用firefox全屏、设置按钮*/
.trump-button[sub-component="fullscreen_btn"],.trump-button[now="fullscreen"]{ display:none!important;}
.trump-button[sub-component="setting"]{ display:none !important;}

/*禁用video的controls（要慎重！不要轻易隐藏掉，会导致点击视频不能播放）*/
video::-webkit-media-controls {
display:none !important;
}
</style>
