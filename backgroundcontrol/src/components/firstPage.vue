<template>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="height: 250px">
          <div style="float: left;height: 210px;padding: 20px;width: 20%;text-align: left">
            <img src="../assets/wwuu.jpeg" alt="" width="200" height="200">
          </div>
          <div style="float: left;height: 210px;padding: 20px;width: 30%">
            <h4>{{msg.userName}}  你好啊！<img src="../assets/male.png" alt="" style="vertical-align: bottom" v-if="msg.sex==1"><img src="../assets/female.png" alt="" style="vertical-align: bottom" v-if="msg.sex==2"></h4>
            <h5>
              <span style="display: inline-block;width: 200px;">所属单位：{{msg.departmentName}}</span>
              <span>角色权限：{{msg.userGroupName}}</span>
            </h5>
            <h5>
              <span style="display: inline-block;width: 200px;">手机号：{{msg.phone}}</span>
              <span>邮箱： {{msg.email}}</span>
            </h5>
          </div>
          <div style="float: left;height: 210px;padding: 20px;text-align: right;width: 20%"><el-button type="primary" @click="dialogVisible=true;">编辑资料</el-button></div>
        </div>
        <div  class="text item" style="display: flex;justify-content: space-between;padding: 20px">
          <div class="h-div">
            <h3>应用总数</h3><h4>{{count?count.appCount:0}}</h4>
          </div>
          <div class="h-div"><h3>在线设备数</h3><h4>{{count?count.onLineEquipmentCount:0}}</h4></div>
          <div class="h-div"><h3>设备总数</h3><h4>{{count?count.equipmentCount:0}}</h4></div>
          <div class="h-div"><h3>用户总数</h3><h4>{{count?count.userCount:0}}</h4></div>
        </div>
      </el-card>
      <el-dialog title="编辑资料" :visible.sync="dialogVisible" width="40%"  @close="getSelfMsg();">
        <el-row :gutter="20">
          <el-col :span="12"><div class="grid-content bg-purple">
            <span class="h-span"><i style="color: red;padding: 3px">*</i>用户名称</span>
            <el-input style="width: 200px;display: inline-block" v-model="userName" maxlength="20"></el-input>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple">
           <span class="h-span"><i style="color: red;padding: 3px">*</i>所属单位</span>
            <el-input style="width: 200px" v-model="departmentName" maxlength="20"></el-input>
          </div></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="12"><div class="grid-content bg-purple">
            <span class="h-span"><i style="color: red;padding: 3px">*</i>性别</span>
            <el-select v-model="sex" placeholder="请选择" style="width: 200px">
              <el-option  label="男" :value="1"></el-option>
              <el-option  label="女" :value="2"></el-option>
            </el-select>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple">
            <span class="h-span">手机号</span>
            <el-input style="width: 200px" v-model="phone" :disabled="true"></el-input>
          </div></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="16"><div class="grid-content bg-purple">
            <span class="h-span">邮箱</span>
            <el-input style="width: 200px" v-model="email" :disabled="true"></el-input>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false;getSelfMsg();">取 消</el-button>
          <el-button type="primary" @click="reviseSelf();">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import {getSelfMsg, reviseSelf, getFirst} from '../http/request'

export default {
  name: 'firstPage',
  created () {
    let oldPass = this.$cookies.get('oldPass')
    oldPass ? this.$router.push('/revisePassword') : ''
    this.getSelfMsg()
    this.getFirst()
  },
  inject: ['reload'],
  data () {
    return {
      msg: '',
      dialogVisible: false,
      userName: '',
      sex: 0,
      email: '',
      phone: '',
      departmentId: '',
      departmentName: '',
      id: '',
      count: {}
    }
  },
  methods: {
    getSelfMsg () {
      getSelfMsg().then(v => {
        v.code ? this.$message.error(v.msg) : (() => {
          console.log(v)
          this.msg = v.data
          this.id = v.data.id
          this.userName = v.data.userName
          this.sex = v.data.sex
          this.email = v.data.email
          this.phone = v.data.phone
          this.departmentId = v.data.departmentId
          this.departmentName = v.data.departmentName
        })()
      })
    },
    reviseSelf () {
      let msg = {
        id: this.id,
        userName: this.userName,
        sex: this.sex,
        departmentName: this.departmentName,
        departmentId: this.departmentId
      }
      this.userName ? (() => {
        this.departmentName ? (() => {
          reviseSelf(msg).then(v => {
            v.code ? this.$message.error(v.msg) : (() => {
              this.$message.success(v.msg)
              this.reload()
            })()
          })
        })() : this.$message.error('单位名称不能为空')
      })() : this.$message.error('用户名不能为空')
    },
    getFirst () {
      getFirst().then(v => {
        console.log(v)
        this.count = v.data
      })
    }
  }
}
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
   height: 450px;
  }
  .h-span{
    display: inline-block;
    width: 70px;
  }
  .h-div{
    width: 200px;
    height: 200px;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
    border-radius: 2px;
    text-align: center;
    padding-top: 20px;
  }
</style>
