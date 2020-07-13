<template>
    <div style="padding: 50px">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">查看</span>
        <el-button type="primary" @click="$router.go(-1)" style="float: right">退出</el-button>
      </div>
      <div>
        <span class="myWords">设备编号：{{$route.query.id}}</span>
        <span class="myWords">设备名称：{{equipmentName}}</span>
        <span class="myWords" style="margin-left: 10px;float: right">设备电量：{{power}}</span>
      </div>
      <div class="mainContainer" >
        <video id="videoElement" class="centeredVideo"  autoplay muted ref="player" >Your browser is too old which doesn't support HTML5 video.</video>
      </div>
      <div style="text-align: center;margin-top: 10px">
        <el-button @click="full()" size="mini">全屏</el-button>
      </div>
      <div id="d1" style="display: none"></div>
    </div>
</template>

<script>
  import flvjs from "../../static/flv.js";
    export default {
        name: "watchFlv",
        data(){
          return{
            videoUrl:'',
            equipmentName:'',
            power:''
          }
        },
        methods:{
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
          full(){
            var dd=this.$refs.player;
            this.requestFullScreen(dd)
          },
        },
        mounted() {
          this.videoUrl=JSON.parse(this.$route.query.rtmpUrl).join('&')
          this.equipmentName=this.$route.query.equipmentName;
          this.power=this.$route.query.power;
          console.log(this.videoUrl,77777777);
          //this.videoUrl='http://10.5.28.148:31670/live?port=1937&app=kxutplive720p&stream=e9cf604ef3cad752a4ecce8e6591c814'
          if (flvjs.isSupported()) {
            let video = this.$refs.player;
            if (video) {
              this.player = flvjs.createPlayer({
                type: "flv",
                isLive: true,
                hasAudio: false,
                url: this.videoUrl
              });
              this.player.attachMediaElement(video);
              try {
                this.player.load();
                this.player.play();
                //console.log(flvjs,777)
              } catch (error) {
                console.log(error);
              };
            }
          }
        }
    }
</script>

<style scoped>
  .mainContainer {
    display: block;
    width: 1024px;
    margin-left: auto;
    margin-right: auto;
  }

  .urlInput {
    display: block;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .centeredVideo {
    display: block;
    width: 900px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: auto;
    border: 1px solid #ddd;
    margin-top: 10px;
  }

  .controls {
    display: block;
    width: 100%;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
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
