<template>
  <div class="nav-common">
    <div class="nav-common" >
      <div class="logo">
        <div>远程指挥后台管理</div>
      </div>
      <div class="user">
        <span class="logoTitle">远程指挥后台管理</span>
        <div @mouseover="block()" @mouseout="block2()" style="height:50px;float:right;">
          <span class="goBack" ><i class="icon_user_default"></i>{{userName}}</span>
          <div class="showBox" :class="{'display':display,'show':show}"  @mouseenter="block()" @mouseleave="block2()">
          <span class="btn_logout cur" @click="$router.push({path:'/modifyPassword'})">修改密码</span>
          <span  class="btn_logout cur" @click="loginOut()" >退出</span>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import {mapState, mapActions} from 'vuex'
import {getBasicInfo} from '../http/request'
export default {
  name: 'headNav',
  data () {
    return {
      roleCode: '',
      userName: '',
      subjectCode: '3',
      display: false,
      show: true
    }
  },
  mounted () {
    this.getInfo()
    function getCookie (name) {
      var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null
    }
    let token = getCookie('remoteBackgroundToken')
    if (token) {
      let arr = token.split('.')
      let tokenMsg = arr[1]
      let tokens = Base64.decode(tokenMsg)
      let Obj = JSON.parse(tokens)
      this.loginName = Obj.loginName
      this.roleCode = Obj.userCode
      this.userName = Obj.userName
    }
    this.$store.dispatch('navMenu/menuInit', {subjectCode: this.subjectCode, roleCode: this.roleCode})
  },
  computed: {
    ...mapState('navMenu', {menus: 'menus'})
  },
  methods: {
    getInfo () {
      getBasicInfo().then(res => {
        if (res.code) {
          this.$message.error(res.msg)
        } else {
          this.userName = res.data.userName
        }
      })
    },
    loginOut () {
      this.$confirm('确认退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/logout')
      }).catch(() => {

      })
    },
    block () {
      this.display = true
      this.show = false
    },
    block2 () {
      this.display = false
      this.show = true
    }
  }

}
</script>

<style scoped>
.nav-common{background:#fff;color: #FF644E; overflow: hidden; height:60px;overflow:hidden}
  .logo{ float:left; width: 210px;background: #fff;height:59px;border-bottom:2px solid #f0f0f0}
  .logo div{ background: url("../assets/logo.png") no-repeat center  center;text-indent:-999px;width: 100%; height: 100%;}

  .user{padding-left:200px;margin-top:20px;text-align: right; font-size: 14px;border-bottom: 2px solid #f0f0f0;height: 39px; line-height: 22px;padding-right: 50px;}
  .logoTitle{
    font-size:22px;font-weight: 500;text-align: left;float: left;margin-left: 20px
  }
  .user span{margin-right:10px;position:relative; }
  .user span.logout{ font-size:16px}
  .cur{ cursor: pointer;
  }
  .goBack{
    cursor: pointer;
  }
  .goBack:after {
    content: " ";
    display: inline-block;
    height: 12px;
    width: 12px;
    border-width: 0px 3px 3px 0;
    border-color: #ccc;
    border-style: solid;
    -webkit-transform: matrix(-0.71, 0.71,0.71, 0.71, 0, 0);
    transform: matrix(-0.71, 0.71, 0.71, 0.71, 0, 0);
    position: absolute;
    right: -25px;
}
.showBox{
  text-align: center;
  top:50px;
  width: 80px;
  height: 60px;
  border: 1px solid #ccc;
  z-index: 999;
  position: absolute;
  right: 20px;
  background: #fff;
  line-height: 26px;
}
.display{
  display: block
}
.show{
  display: none
}
  .icon_user_default{background: url("../assets/icon_user_default.png") no-repeat center  center;display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px}
  /* .icon_user_admin{background: url("../assets/icon_user_admin.png") no-repeat center  center;display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px}
  .icon_user_supadmin{background: url("../assets/icon_user_supadmin.png") no-repeat center  center;display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px}  */
</style>
