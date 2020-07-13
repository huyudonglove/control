<template>
  <div>
    <div v-if="$route.name=='controlList'">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="在线列表" name="first"></el-tab-pane>
        <el-tab-pane label="离线列表" name="second"></el-tab-pane>
      </el-tabs>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span class="myWords">
          设备名称：
          <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder=""></el-input>
        </span>
        <span v-if="status==2" class="myWords">
          应用名称：
          <el-select v-model="appKey" @change="replace('page',1)">
            <el-option v-for="(item,i) in applicationList" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </span>
        <!-- <span>
          设备型号：
          <el-select v-model="modelId" @change="replace('page',1)">
            <el-option v-for="(item,i) in modelList" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span> -->
        <span v-if="status==1" class="myWords">
          监控状态：
          <el-select v-model="monitorStatus" @change="replace('page',1)">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="监控中"></el-option>
            <el-option value="2" label="空闲"></el-option>
          </el-select>
        </span>
      </el-row>
      <el-table ref="userRef" :data="modelTable" border style="width: 100%" class="mt15 mb15 el-table" :max-height="tableHeight" v-cloak>
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="appName" label="应用名称" width="" align="center" :key="12"></el-table-column>
        <el-table-column prop="code" label="设备号" align="center"></el-table-column>
        <el-table-column prop="equipmentName" label="设备名称" align="center" :key="11"></el-table-column>
        <el-table-column prop="equipmentSpecName" label="设备型号" align="center">
          <template slot-scope="scope">
            <span :style="{'color':scope.row.equipmentSpecName?'':'red'}">{{scope.row.equipmentSpecName?scope.row.equipmentSpecName:'/'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="power" label="电量" align="center" width="120" v-if="status==1">
          <template slot-scope="scope">
            <span :style="{'color':!scope.row.power?'red':scope.row.power>50?'#339900':'#E6A23C'}">{{scope.row.power?scope.row.power+'%':'/'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="streamStartTime" label="最新上线时间" align="center" width="200" v-if="status==1" key=1></el-table-column>
        <el-table-column prop="streamEndTime" label="离线时间" align="center" width="200" v-if="status==2" key=6></el-table-column>
        <el-table-column prop="monitorStatus" label="监控状态" align="center" width="150" v-if="status==1" >
          <template slot-scope="scope">
            <span v-if="scope.row.monitorStatus==1" >监控中</span>
            <span v-if="scope.row.monitorStatus==2" >空闲</span>
          </template>
        </el-table-column>
         <el-table-column prop="monitorByName" label="监控客服" align="center" width="150" v-if="status==1" key="4">
          <template slot-scope="scope">
            {{scope.row.monitorByName?scope.row.monitorByName:'-'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center" v-if="status==1" key=3>
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="$router.push({path:'/vueFlv',query:{id:scope.row.id}})" v-if="scope.row.monitorStatus==2">监控</el-button>
            <el-button type="warning" size="mini" @click="openWin(scope.row.id)" >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
       <pagination :totalNum="total"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from '../../share/pagination'
import {getEquipList,modelDropDown,applicationDropDown,getVideoUrl} from '../../http/request'
export default {
  name:'controlList',
  inject:['replace','reload'],
  data(){
    return{
      inputX:'',
      modelTable:[],
      tableHeight:250,
      status:'',
      modelId:'',
      modelList:[],
      applicationList:[],
      appKey:'',
      total:0,
      activeName: 'first',
      mySetInterval:null,
      monitorStatus:null
    }
  },
  computed:{

  },
  watch:{
    inputX(){
      this.replace('searchText',this.inputX);
    },
    appKey(){
      this.appKey !=='全部'?this.replace('appKey',this.appKey):this.replace('appKey','');
    },
    status(){
      this.replace('status',this.status);
    },
    monitorStatus(){
      this.monitorStatus !=='全部'?this.replace('monitorStatus',this.monitorStatus):this.replace('monitorStatus','');
    },
    activeName(){
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='controlList'){
        this.listData();
      }
    }
  },
  methods:{
    getApplicationList(){
      applicationDropDown().then(res=>{
        this.applicationList = res.data;
        this.applicationList.unshift({id:'',name:'全部'});
      })
    },
    getDropDown(){
      modelDropDown().then(res=>{
        this.modelList = res.data;
        this.modelList.unshift({id:'',name:'全部'});
      })
    },
    listData(){
      if(!this.$route.query.status) return;
      getEquipList(this.$route.query).then(res=>{
        this.modelTable=res.data.items;
        this.total=res.data.total;
      })
    },
    handleClick(tab, event) {
        tab.name=='first'?this.status=1:this.status=2
        this.inputX = '';
        this.appKey = '';
        this.modelId = '';
        this.replace('page','1')
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 500);
      },
      openWin(id) {
        getVideoUrl({id}).then(res=>{
        if(res.data){
          let rtmpUrl = JSON.stringify(res.data.videoPullAddress.rtmpAddress.split('&'));
          let equipmentName=res.data.equipmentName;
          let power=res.data.power;
          let routes = this.$router.resolve({ name: "watchFlv" });
          this.$router.push({
            path:'watchFlv',
            query:{
              rtmpUrl:rtmpUrl,
              power:power,
              equipmentName:equipmentName,
              id:res.data.code
            }
          })
          //window.open(`${routes.href}?rtmpUrl=${rtmpUrl}&id=${id}&equipmentName=${equipmentName}&power=${power}`, "_blank","height=510,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no");
        }else{
          this.$message.error('没有播放地址')
        }
      })
      }

    },
  created(){
    this.inputX = this.$route.query.searchText||'';
    this.appKey = this.$route.query.appKey||'';
    this.modelId =  parseInt(this.$route.query.equipmentSpecId)||'';
    this.status=this.$route.query.status||1
    this.status==1?this.activeName='first':this.activeName='second';
    // this.getDropDown();
    this.getApplicationList();
    this.listData();
    this.mySetInterval = setInterval(this.listData,30000);
  },
  updated(){
    if(this.$route.name=='controlList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  },
   destroyed(){
    clearInterval(this.mySetInterval);
  },
  components:{
    pagination
  },
}
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
