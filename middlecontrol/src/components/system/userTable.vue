<template>
  <div v-if="userPower.length">
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">用户列表</span>
      <el-button :disabled="!userPower[2].isCheck" style="float:right;" type="primary" @click="$router.push({path:'/addUser'})">添加用户</el-button>
    </div>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
      <span class="myWords">
        用户名称
        <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入用户名称" @change="replace('page',1);"></el-input>
      </span>
    </el-row>
    <el-table ref="userRef" :data="userList" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight">
      <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机账号" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱账号" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="250" align="center">
        <template slot-scope="scope">
          <el-button :disabled="!userPower[1].isCheck" type="primary" size="mini" @click="$router.push({path:'/addUser',query:{id:scope.row.id}})">编辑</el-button>
          <el-button :disabled="!userPower[1].isCheck" type="warning" size="mini" @click="resetPwd(scope.row.id)">重置密码</el-button>
          <el-button :disabled="!userPower[3].isCheck" type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
        <pagination :totalNum="totalNum"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from '../../share/pagination'
import {getUserTable,resetSystemPassword,delSystemUser} from '../../http/request'
import { mapState } from "vuex";
export default {
  name:'userTable',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      userList:[],
      tableHeight:0,
      totalNum:0
    }
  },
  watch:{
    inputX(){
      this.replace('userName',this.inputX);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='userTable'){
        this.listData();
      }
    },
  },
  computed:{
    ...mapState('currentUserPower',{userPower:'userPower'}),
  },
  methods:{
    del(id){
      delSystemUser({id}).then(res=>{
        if(this.userList.length==1){
          this.replace('page',1);
        }
        this.reload();
      })
    },
    resetPwd(id){
      resetSystemPassword({id}).then(res=>{
        
      })
    },
    listData(){
      getUserTable(this.$route.query).then(res=>{
        this.userList=res.data.items;
        this.totalNum = res.data.total;
      })
    },
  },
  created(){
    this.listData();
    this.inputX = this.$route.query.userName||'';
  },
  updated(){
    if(this.$route.name=='userTable'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    } 
  }
}
</script>

<style scoped>

</style>