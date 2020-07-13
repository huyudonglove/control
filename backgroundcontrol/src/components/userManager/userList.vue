<template>
  <div>
    <div v-if="$route.name=='userList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">用户管理</span>
        <el-button style="float:right;" type="primary" @click="$router.push({path:'/userList/createuser',query:{oldQuery:JSON.stringify($route.query)}})">添加用户</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span class="myWords">
          <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入手机号/用户名"></el-input>
        </span>
        <span class="myWords">
          用户组
          <el-select v-model="userGroupId" style="width:150px;">
            <el-option v-for="(item,i) in userGroupList" :key=i :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
        <span class="myWords">
          账号状态
          <el-select v-model="status" style="width:150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </span>
        <el-button type="danger" @click="lotEnable">批量禁用</el-button>
      </el-row>
      <el-table ref="userRef" :data="userTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" @select="appSelect" @select-all="appSelectAll">
        <el-table-column type="selection" width="50" ></el-table-column>
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
        <el-table-column prop="departmentName" label="所属单位" align="center"></el-table-column>
        <el-table-column prop="userGroupName" label="用户组" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" width="50" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sex==1">男</span>
            <span v-if="scope.row.sex==2">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="appCount" label="应用数量" align="center">
          <template slot-scope="scope">
            <a href="javascript:void(0);" @click="showAppDialog(scope.row.id)">{{scope.row.appCount}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginIP" label="最后登录IP" align="center"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" align="center"></el-table-column>
        <el-table-column prop="status" label="账号状态（启用/禁用）" width="180" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              @change="up(scope.row.status,scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="$router.push({path:'/userList/createuser',query:{id:scope.row.id,oldQuery:JSON.stringify($route.query)}})">编辑</el-button>
            <el-button type="warning" size="mini" @click="resetPwd(scope.row.id)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination v-if="showPagination"></pagination>
      </div>
      <div v-if="isShowApp">
        <appDialog :userId="selectUserId" @appDialogClose="appDialogClose"></appDialog>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import pagination from '../../share/pagination'
import appDialog from './appDialog'
import {getUserList,setStatus,resetPassword,userDropDown} from '../../http/request'
export default {
  name:'userList',
  inject:['replace','reload'],
  components:{
    pagination,
    appDialog
  },
  data(){
    return{
      inputX:'',
      status:'',
      userGroupId:'',
      userGroupList:[],
      userTable:[],
      showPagination:false,
      tableHeight:0,
      appIdList:[],
      isShowApp:false,//显示应用列表
      selectUserId:'',//选择的行Id
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  },
  watch:{
    page(){
      this.replace('pageNum',this.page);
    },
    limit(){
      this.replace('pageSize',this.limit);
    },
    inputX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('searchText',this.inputX);
      this.appIdList=[];//清空选择
    },
    status(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('status',this.status);
      this.appIdList=[];//清空选择
    },
    userGroupId(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('userGroupId',this.userGroupId);
      this.appIdList=[];//清空选择
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='userList'){
        this.listData();
      }
    }
  },
  methods:{
    appSelect(arr,row){
      if(arr.map(v=>v.id).indexOf(row.id)==-1){
        this.appIdList = this.appIdList.filter(v=>v!=row.id);
      }else{
        this.appIdList.push(row.id);
      }
    },
    appSelectAll(arr){
      if(arr.length){
        this.appIdList=this.appIdList.filter(v=>arr.map(v=>v.id).indexOf(v)==-1);
        this.appIdList=this.appIdList.concat(arr.map(v=>v.id))
      }else{
        this.appIdList=this.appIdList.filter(v=>this.userTable.map(v=>v.id).indexOf(v)==-1);
      }
    },
    clashAPP(){//将选择行的勾上
      let selectAllRow=[];
      for(let i=0;i<this.appIdList.length;i++){
        var row=this.userTable.find(v=>v.id==this.appIdList[i]);
        if(row){
          selectAllRow.push(row);
        }
      };
      this.$nextTick(()=>{
        selectAllRow.forEach(v=>{
          this.$refs.userRef.toggleRowSelection(v,true); 
        })
      });
    },
    lotEnable(){
      if(!this.appIdList.length){
        this.$message.error('请勾选需要禁用的用户');
        return;
      }
      setStatus({"ids":this.appIdList,"status":2}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.$message.success(res.msg);
          this.reload();
        }
      })
    },
    up(status,id){
      let notice,resetStatus;
      if(status==1){
        notice = '确认启用吗？';
        resetStatus = 2;
      }else{
        notice = '确认禁用吗？';
        resetStatus = 1;
      }
      this.$confirm(notice).then(u=>{
        setStatus({"ids":[id],status}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
            this.userTable.forEach(v=>{if(v.id==id){v.status=resetStatus;}});
          }else{
            this.$message.success(res.msg);
          }
        }).catch(err=>{
          this.userTable.forEach(v=>{if(v.id==id){v.status=resetStatus;}});
        })
      }).catch(error=>{
        this.userTable.forEach(v=>{if(v.id==id){v.status=resetStatus;}});
      })
    },
    appDialogClose(){//关闭应用列表
      this.isShowApp=false;
      this.selectUserId='';
      this.listData();
    },
    showAppDialog(userId){//显示应用列表
      this.isShowApp=true;
      this.selectUserId=userId;
    },
    resetPwd(id){
      resetPassword({id}).then(res=>{
        this.reload();
      })
    },
    getDropDown(){
      userDropDown().then(res=>{
        this.userGroupList = res.data;
        this.userGroupList.unshift({id:'',name:'全部'});
      })
    },
    listData(){
      getUserList(this.$route.query).then(res=>{
        this.userTable=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
        this.clashAPP();
      })
    },
  },
  created(){
    this.getDropDown();
    this.listData();
    let pageRecord = this.$route.query.pageNum||1;//记录上一次页码操作
    let limitRecord = this.$route.query.pageSize||20;//记录上一次limit操作
    this.inputX = this.$route.query.searchText||'';
    this.status = this.$route.query.status||'';
    this.userGroupId = this.$route.query.userGroupId?parseInt(this.$route.query.userGroupId):'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='userList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>