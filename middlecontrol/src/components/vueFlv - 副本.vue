<template>
    <div style="padding: 50px">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">监控</span>
        <el-button type="primary" @click="unableMonitor" style="float: right">退出监控</el-button>
      </div>
      <div>
        <span class="myWords">设备名称：{{equipmentName}}</span>
        <span class="myWords" style="margin-left: 10px">设备电量：{{power}}</span>
      </div>
      <div class="mainContainer" @click="pushMe()">
        <video id="videoElement" class="centeredVideo"  autoplay muted ref="player" @click="getWH()">Your browser is too old which doesn't support HTML5 video.</video>
      </div>
      <div id="d1" style="display: none"></div>
      <div style="text-align: center;margin-top: 10px">
        <el-button @click="full()" size="mini">全屏</el-button>
        <el-button @click="sendControlToApp(id,1,'开始监控')" v-if="control" size="mini" type="primary">发起远程控制</el-button>
        <el-button @click="endControlToApp(id,3,'结束监控')" v-if="end" size="mini" type="danger">结束远程控制</el-button>
        <span v-if="loading" class="myWords" style="color: red">发起中</span>
      </div>
      <div>
        {{videoSrc1}}-----{{str}}
      </div>
    </div>
</template>

<script>
  import {unableMonitor,sendMonitorStatus,sendControlToApp,getAppReply,sendPositionInfo,enableMonitor} from "../http/request";
  import flvjs from "../../static/flv.js";
    export default {
        name: "vueFlv",
        data(){
          return{
            screen_width:0,
            screen_height:0,
            video_width:0,
            video_height:0,
            x:0,
            y:0,
            new_x:0,
            new_y:0,
            //videoUrl:`http://10.5.28.249:9080/live?port=1935&app=utplive&stream=ab35afade9aa1h2gij`,
            videoUrl:'http://10.5.28.249:9080/live?port=1935&app=utplive4k&stream=utpa360pro3',
            //videoUrl:'',
            player:null,
            timer:null,
            str:'',
            control:true,
            num:0,
            timerT:null,
            end:false,
            id:'',
            controlAble:false,
            loading:false,
            equipmentName:'',
            power:'',
            videoSrc1:''
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
          getWH(){
            var dd=this.$refs.player;
            console.log(dd.clientWidth,dd.clientHeight);//播放视频尺寸
            console.log(window.event.offsetX,window.event.offsetY)//点击坐标
            console.log(window.event.target.videoWidth,window.event.target.videoHeight)//原始视频尺寸
            this.screen_width=dd.clientWidth;
            this.screen_height=dd.clientHeight;
            this.video_width=window.event.target.videoWidth;
            this.video_height=window.event.target.videoHeight;
            this.x=window.event.offsetX;
            this.y=window.event.offsetY;
            this.str=document.getElementById('d1').innerText;
            console.log(this.str,7777);
            this.controlAble&&this.computedWH();
            this.videoSrc1=new Date().toLocaleString()+'--'+new Date().getTime();
          },
          computedWH(){
            let params={
              id:this.id,
              position:{
                ext:JSON.parse(this.str),
                uv:{
                  u:'',
                  v:''
                }
              }
            }

            var screen_ratio=this.screen_width/this.screen_height;
            var video_ratio=this.video_width/this.video_height;
            var factor=1;
            if (screen_ratio == video_ratio) {
              console.log(1)
               factor = this.screen_width / this.video_width;
              this.new_x = parseInt(this.x / factor);
              this.new_y = parseInt(this.y / factor);
              params.position.uv.u=this.new_x;
              params.position.uv.v=this.new_y;
              this.sendPositionInfo(params);
            }else {
              if (screen_ratio < video_ratio) {
                console.log(2)
                factor = this.screen_width / this.video_width;
                var  new_height = this.video_height * factor;
                var  border_heigth = (this.screen_height - new_height) / 2;
                if (this.y > border_heigth && this.y < this.screen_height - border_heigth) {
                  this.new_x = parseInt(this.x / factor);
                  this.new_y = parseInt((this.y - border_heigth) / factor);
                  params.position.uv.u=this.new_x;
                  params.position.uv.v=this.new_y;
                  this.sendPositionInfo(params);
                }else {
                  this.$message.error('无效位置')
                }
              }else {
                console.log(3)
                 factor = this.screen_height / this.video_height;
                var new_width = this.video_width * factor;
                var  border_width = (this.screen_width - new_width) / 2;
                if (this.y > border_width && this.y < this.screen_width - border_width) {
                  this.new_y = parseInt(this.y / factor);
                  this.new_x = parseInt((this.x - border_width) / factor);
                  params.position.uv.u=this.new_x;
                  params.position.uv.v=this.new_y;
                  this.sendPositionInfo(params);
                }else {
                  this.$message.error('无效位置')
                }
              }
            }
            console.log(this.new_x,this.new_y,77777)
          },
          unableMonitor(){
            this.$confirm(`确认退出吗`,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(v=>{
              unableMonitor(this.id).then(v=>{
                this.$router.go(-1)
              })
            }).catch(r=>{

            })

          },
          sendMonitorStatus(){
            sendMonitorStatus(this.id)
          },
          sendControlToApp(id,type,name){
            this.$confirm(`确认${name}吗`,'提示',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(v=>{
              this.control=false;
              this.loading=true;
              sendControlToApp(id,type).then(res=>{
                res.code&&this.$message.error(res.msg);
                !res.code&&this.getAppReply();
              })
            }).catch(r=>{

            })
          },
          endControlToApp(id,type,name){
            this.$confirm(`确认${name}吗`,'提示',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(v=>{
              this.end=false;
              this.control=true;
              this.controlAble=false;
              sendControlToApp(id,type).then(res=>{
                res.code&&this.$message.error(res.msg);
                !res.code&&(()=>{
                  this.control=true;
                  this.end=false;
                })();
              })
            }).catch(r=>{

            })
          },
          getAppReply(){
            //getAppReply();
            var self=this;
            this.num<11&&(()=>{
              var apple=function () {
                getAppReply(self.id).then(res=>{
                  console.log(res,77)
                        res.data&&(()=>{
                          console.log(1)
                          res.data==1&&(()=>{
                            self.end=true;
                            self.control=false;
                            self.controlAble=true;
                            self.loading=false;
                            self.num=0;
                            clearInterval(self.timerT)
                          })();
                          res.data==2&&this.$message.error(res.msg)&&(()=>{
                            self.end=false;
                            self.control=true;
                            self.controlAble=false;
                            self.loading=false;
                            self.num=0;
                            clearInterval(self.timerT)
                          })();
                        })();
                        !res.data&&(()=>{
                          console.log(2)
                          self.num++;
                          self.loading=true;
                          self.control=false;
                          console.log(self.num,888888)
                        })();

                }).catch(r=>{

                })
              };
              var _apple=function(){
                return apple;
              }
              self.timerT=setInterval(_apple(),3000)
            })();
          },
          sendPositionInfo(params){
           sendPositionInfo(params).then(res=>{
              res.code&&this.$message.error(res.msg);
              !res.code&&this.$message.success(res.msg);
           })
          },
          enableMonitor(){
            return new Promise((r,j)=>{
              enableMonitor(this.id).then(res=>{
                res.code&&this.$message.error(res.msg)&&this.$router.go(-1);
                !res.code&&(()=>{
                  console.log(res)
                  //this.videoUrl=res.data.videoPullAddress.rtmpAddress;
                  this.equipmentName=res.data.equipmentName;
                  this.power=res.data.power;
                  r(res);
                })();

              })
            })
          },
          pushMe(){
            var dd=this.$refs.player;
            dd.paused&&dd.play();
            !dd.paused&&dd.pause();
          }
        },
        mounted() {
          this.enableMonitor().then(r=>{
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
          });

          //this.timer=setInterval(this.sendMonitorStatus,30000)
        },
      beforeDestroy(){

      },
        watch:{
          num(){
            this.num>10&&(()=>{
              clearInterval(this.timerT);
              this.$message.error('暂无响应');
              this.control=true;
              this.loading=false;
              this.num=0;
            })();

          }
        },
      created(){
        this.id=this.$route.query.id;
      },
        destroyed() {
          clearInterval(this.timer);
          clearInterval(this.timerT)
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
