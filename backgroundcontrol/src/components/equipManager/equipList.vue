<template>
  <div>
    <div v-if="$route.name=='equipList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">设备列表</span>
        <el-button style="float:right;" type="primary" @click="$router.push({path:'/equipList/createEquip',query:{oldQuery:JSON.stringify($route.query)}})">创建设备</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span class="myWords">
          <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入设备号"></el-input>
        </span>
        <span class="myWords">
          设备状态
          <el-select v-model="status" style="width:150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="在线" value="1"></el-option>
            <el-option label="离线" value="2"></el-option>
          </el-select>
        </span>
        <span class="myWords">
          设备型号
          <el-select v-model="modelId" style="width:150px;">
            <el-option v-for="(item,i) in modelList" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
        <el-button type="danger" @click="lotDel">批量删除</el-button>
      </el-row>
      <el-table ref="userRef" :data="equipTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" @select="appSelect" @select-all="appSelectAll">
        <el-table-column type="selection" width="50" ></el-table-column>
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="code" label="设备号" align="center"></el-table-column>
        <el-table-column prop="equipmentSpecName" label="设备型号" align="center">
          <template slot-scope="scope">
            <span :style="{'color':scope.row.equipmentSpecName?'':'red'}">{{scope.row.equipmentSpecName?scope.row.equipmentSpecName:'/'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="power" label="电量" align="center">
          <template slot-scope="scope">
            <span :style="{'color':scope.row.power>50&&scope.row.status==1?'#339900':0<scope.row.power<50&&scope.row.status==1?'#E6A23C':'red'}">{{scope.row.power&&scope.row.status==1?scope.row.power+'%':'/'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="设备状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1" style="color:#339900;">在线</span>
            <span v-if="scope.row.status==2" style="color:red;">离线</span>
          </template>
        </el-table-column>
        <el-table-column prop="userCount" label="用户数量" align="center">
          <template slot-scope="scope">
            <a href="javascript:void(0);" @click="showAppDialog(scope.row.id)">{{scope.row.userCount}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最新登录时间" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="250" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="$router.push({path:'/equipList/createEquip',query:{id:scope.row.id,oldQuery:JSON.stringify($route.query)}})">编辑</el-button>
            <el-button type="warning" size="mini" @click="openVideo(scope.row.id)">查看</el-button>
            <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination v-if="showPagination"></pagination>
      </div>
      <div v-if="isShowApp">
        <userDialog :userId="selectUserId" @appDialogClose="appDialogClose"></userDialog>
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
import userDialog from './userDialog'
import {getEquipList,delEquip,modelDropDown,getVideoUrl} from '../../http/request'
export default {
  name:'equipList',
  inject:['replace','reload'],
  components:{
    pagination,
    userDialog
  },
  data(){
    return{
      inputX:'',
      equipTable:[],
      showPagination:false,
      tableHeight:0,
      appIdList:[],
      status:'',
      modelId:'',
      modelList:[],
      isShowApp:false,
      selectUserId:'',//选择的行Id
      mySetInterval:null
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
    modelId(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('equipmentSpecId',this.modelId);
      this.appIdList=[];//清空选择
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='equipList'){
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
        this.appIdList=this.appIdList.filter(v=>this.equipTable.map(v=>v.id).indexOf(v)==-1);
      }
    },
    clashAPP(){//将选择行的勾上
      let selectAllRow=[];
      for(let i=0;i<this.appIdList.length;i++){
        var row=this.equipTable.find(v=>v.id==this.appIdList[i]);
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
    appDialogClose(){//关闭列表
      this.isShowApp=false;
      this.selectUserId='';
      this.listData();
    },
    showAppDialog(userId){//显示列表
      this.isShowApp=true;
      this.selectUserId=userId;
    },
    openVideo(id){
      getVideoUrl({id}).then(res=>{
        if(res.data){
          let rtmpUrl = JSON.stringify(res.data.rtmpAddress.split('&'));
          let routes = this.$router.resolve({ name: "vueFlv" });
          window.open(`${routes.href}?rtmpUrl=${rtmpUrl}&id=${id}`, "_blank","height=510,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no");
        }else{
          this.$message.error('没有播放地址')
        }
      })
    },
    del(id){
      delEquip({"ids":[id],"isBatch":false}).then(res=>{
        if(this.equipTable.length==1){
          this.replace('pageNum',1);
        }else{
          this.reload();
        }
      })
    },
    lotDel(){
      if(this.appIdList.length){
        delEquip({"ids":this.appIdList,"isBatch":true}).then(res=>{
          this.replace('pageNum',1);
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要删除的设备');
      }
    },
    getDropDown(){
      modelDropDown().then(res=>{
        this.modelList = res.data;
        this.modelList.unshift({id:'',name:'全部'});
      })
    },
    listData(){
      getEquipList(this.$route.query).then(res=>{
        this.equipTable=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
        this.clashAPP();
      })
    },
  },
  created(){
    this.getDropDown();
    this.listData();
    this.mySetInterval = setInterval(this.listData,30000);
    let pageRecord = this.$route.query.pageNum||1;//记录上一次页码操作
    let limitRecord = this.$route.query.pageSize||20;//记录上一次limit操作
    this.inputX = this.$route.query.searchText||'';
    this.status = this.$route.query.status||'';
    this.modelId = this.$route.query.equipmentSpecId?parseInt(this.$route.query.equipmentSpecId):'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  destroyed(){
    clearInterval(this.mySetInterval);
  },
  updated(){
    if(this.$route.name=='equipList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>