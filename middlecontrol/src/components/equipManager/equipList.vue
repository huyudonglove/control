<template>
  <div v-if="equipPower.length">
    <div v-if="$route.name=='equipList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">设备列表</span>
        <el-button :disabled="!equipPower[2].isCheck" style="float:right;" type="primary" @click="$router.push({path:'/equipList/createEquip',query:{oldQuery:JSON.stringify($route.query)}})">创建设备</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span class="myWords">
          <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入设备名称/设备号" @change="replace('page',1);"></el-input>
        </span>
        <span class="myWords">
          设备状态
          <el-select v-model="status" style="width:150px;" @change="replace('page',1);">
            <el-option label="全部" value=""></el-option>
            <el-option label="在线" value="1"></el-option>
            <el-option label="离线" value="2"></el-option>
          </el-select>
        </span>
        <span class="myWords">
          设备型号
          <el-select v-model="modelId" style="width:150px;" @change="replace('page',1);">
            <el-option v-for="(item,i) in modelList" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
        <el-button :disabled="!equipPower[3].isCheck" type="danger" @click="lotDel">批量删除</el-button>
      </el-row>
      <el-table ref="userRef" :data="equipTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="equipmentName" label="设备名称" align="center"></el-table-column>
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
        <el-table-column prop="lastLoginTime" label="最新登录时间" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="250" align="center">
          <template slot-scope="scope">
            <el-button :disabled="!equipPower[1].isCheck" type="primary" size="mini" @click="$router.push({path:'/equipList/createEquip',query:{id:scope.row.id,oldQuery:JSON.stringify($route.query)}})">编辑</el-button>
            <el-button :disabled="!equipPower[3].isCheck" type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination :totalNum="total" ></pagination>
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
import {getEquipTable,delEquip,modelDropDown} from '../../http/request'
export default {
  name:'equipList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      equipTable:[],
      // showPagination:false,
      tableHeight:0,
      appIdList:[],
      status:'',
      modelId:'',
      modelList:[],
      total:0,
      mySetInterval:null
    }
  },
  computed:{
    ...mapState('currentUserPower',{equipPower:'equipPower'}),
  },
  watch:{
    inputX(){
      this.replace('searchText',this.inputX);
      this.appIdList=[];//清空选择
    },
    status(){
      this.replace('status',this.status);
      this.appIdList=[];//清空选择
    },
    modelId(){
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
    handleSelectionChange(val) {
      this.appIdList=val.map(v=>v.id)
    },
    del(id){
      delEquip({"ids":[id],"isBatch":false}).then(res=>{
        if(this.equipTable.length==1){
          this.replace('page',1);
        }else{
          this.reload();
        }
      })
    },
    lotDel(){
      if(this.appIdList.length){
        delEquip({"ids":this.appIdList,"isBatch":true}).then(res=>{
          this.replace('page',1);
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
      getEquipTable(this.$route.query).then(res=>{
        this.equipTable=res.data.items;
        this.total = res.data.total;
      })
    },
  },
  created(){
    this.getDropDown();
    this.listData();
    this.mySetInterval = setInterval(this.listData,30000);
    this.inputX = this.$route.query.searchText||'';
    this.status = this.$route.query.status||'';
    this.modelId = this.$route.query.equipmentSpecId?parseInt(this.$route.query.equipmentSpecId):'';
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
