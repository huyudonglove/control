<template>
  <div v-if="infoPower.length">
    <div v-if="$route.name=='userInfo'">
      <el-card class="box-card" style="margin-bottom:10px;">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
          <el-button :disabled="!infoPower[1].isCheck" style="float: right;" type="primary" size="mini" @click="$router.push({path:'/userInfo/editInfo',query:{Info:JSON.stringify(form)}})">编辑基本信息</el-button>
        </div>
        <div class="text item">
          <el-avatar style="margin-left:30px;" :size="150" :src="require('../../assets/headPhoto.jpg')"></el-avatar>
          <div style="margin-left:20px;display:inline-block;vertical-align:top;">
            <el-form :inline="true" label-width="140px">
              <el-form-item label="用户名称：">
                <span>{{form.userName}}</span>
              </el-form-item>
              <el-form-item label="性别：">
                <span>{{form.sex==1?'男':'女'}}</span>
              </el-form-item>
              <el-form-item label="所属单位：">
                <span>{{form.departmentName}}</span>
              </el-form-item>
            </el-form>
            <el-form :inline="true" label-width="140px">
              <el-form-item label="用户组：">
                <span>{{form.userGroupName}}</span>
              </el-form-item>
              <el-form-item label="手机号：">
                <span>{{form.phone}}</span>
              </el-form-item>
              <el-form-item label="邮箱：">
                <span>{{form.email}}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>应用列表</span>
        </div>
        <div>
          <el-table ref="multipleTable" :data="applicationList.slice((playPage - 1) * playLimit, playPage * playLimit)" border style="width: 100%" class="mt15 mb15">
            <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
            <el-table-column prop="logo" label="应用logo" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.imgUrl?`/static/${scope.row.imgUrl}`:''" alt="" style="width:100px;height:100px;" v-focus>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="应用名称" align="center"></el-table-column>
            <el-table-column prop="typeId" label="所属分类" align="center">
              <template slot-scope="scope">
                <span>{{typeList.length?typeList.find(v=>v.id==scope.row.typeId).name:''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="appSizeChange"
            @current-change="appCurrentChange"
            :current-page="playPage"
            :page-sizes="[ 20, 40, 60,80]"
            :page-size="playLimit"
            layout="total,sizes, prev, pager, next,jumper"
            :total="playTotal?playTotal:0">
          </el-pagination>
        </div>
      </el-card>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import {getBasicInfo,selectAppList,appType} from '../../http/request'
import { Base64 } from 'js-base64';
import { mapState } from "vuex";
export default {
  name:'userInfo',
  data(){
    return{
      form:{
        id:'',
        userName:'',
        sex:'',
        userGroupId:'',
        userGroupName:'',
        departmentId:'',
        departmentName:'',
        phone:'',
        email:'',
      },
      applicationList:[],
      typeList:[],
      playPage:1,
      playLimit:20,
      playTotal:0,
    }
  },
  computed:{
    ...mapState('currentUserPower',{infoPower:'infoPower'}),
  },
  methods: {
    appSizeChange(value){
      this.playLimit = value;
    },
    appCurrentChange(value){
      this.playPage = value;
    },
    getInfo () {
      getBasicInfo().then(res => {
        if (res.code) {
          this.$message.error(res.msg)
        } else {
          this.form.id = res.data.id
          this.form.userName = res.data.userName
          this.form.sex = res.data.sex
          this.form.userGroupId = res.data.userGroupId
          this.form.userGroupName = res.data.userGroupName
          this.form.departmentId = res.data.departmentId
          this.form.departmentName = res.data.departmentName
          this.form.phone = res.data.phone
          this.form.email = res.data.email
          this.getList(res.data.id)
        }
      })
    },
    getType(){
      appType().then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.typeList = res.data;
        }
      })
    },
    getList(id){
      selectAppList({id}).then(res=>{
        this.playTotal=res.data?res.data.length:0;
        this.applicationList=res.data?res.data.map(v=>{
            v.logo?v.imgUrl=Base64.decode(v.logo):null;
            return v;
          }):[];
      })
    },
  },
  created () {
    this.getInfo();
    this.getType()
  }
}
</script>
<style scoped>

</style>
