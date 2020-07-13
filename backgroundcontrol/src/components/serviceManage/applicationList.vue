<template>
  <div>
    <div v-if="$route.name=='applicationList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">应用管理</span>
        <el-button  style="float:right;" type="primary" @click="$router.push({path:'/serviceManage/applicationList/applicationCreate',query:{msg:JSON.stringify($route.query)}})">新增</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
       <span>
          应用名称：
        <el-input v-model.trim="wd" style="width:15%" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入应用名称"></el-input>
       </span>
       <el-button type="danger"  @click="delAll()" :disabled="multipleSelection.length==0">批量删除</el-button>
      </el-row>
      <el-table ref="multipleTable" :data="tableData" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="logo" label="应用logo" align="center" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.logo?`${scope.row.logo}`:null" alt=""  style="width:70px;height:70px;" v-focus>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="应用名称" align="center"></el-table-column>
        <el-table-column prop="typeId" label="所属分类" align="center" width="120">
           <template slot-scope="scope">
            <span v-if="scope.row.typeId==1">游戏类</span>
            <span v-if="scope.row.typeId==2">应用类</span>
          </template>
        </el-table-column>
        <el-table-column prop="packageName" label="Package Name" align="center"></el-table-column>
        <el-table-column prop="bundleId" label="Bundel ID" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"  width="180"></el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <el-button  type="primary" size="mini" @click="$router.push({path:'/serviceManage/applicationList/applicationCreate',query:{id:scope.row.id,msg:JSON.stringify($route.query)}})">编辑</el-button>
            <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination v-if="showPagination"></pagination>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { Base64 } from 'js-base64'
import pagination from '../../share/pagination'
import {applicationList,applicationDel} from '../../http/request'
export default {
  name:'applicationList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      wd:'',
      tableData:[],
      showPagination:false,
      tableHeight:250,
      multipleSelection:[],
      appIds:[],
      getRowKeys(row) {
   		return row.id;
	},
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  },
  watch:{
    page(){
      this.replace('page',this.page);
    },
    limit(){
      this.replace('limit',this.limit);
    },
    wd(){
      this.$refs.multipleTable.clearSelection();
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('wd',this.wd);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='applicationList'){
        this.listData();
      }
    }
  },
  methods:{
    listData(){
      applicationList(this.$route.query).then(res=>{
        this.tableData=res.data.items;
         this.tableData = this.tableData.map(v => {
          v.logo = `/static/${Base64.decode(v.logo)}`
          return v
        })
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
    del(id){
      applicationDel({appIds:[id]}).then(res=>{
        if(res.code){
            this.$message.error(res.msg);
          }else{
            if(this.tableData.length==1){
              this.$store.commit('pagination/setClickPage',1);//重置第1页
            }
            this.reload()
          }
      })
    },
    delAll(){
      applicationDel({appIds:this.appIds}).then(res=>{
        if(res.code){
            this.$message.error(res.msg);
          }else{
            this.$store.commit('pagination/setClickPage',1);//重置第1页
            this.reload()
          }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.appIds=this.multipleSelection.map(v=>v.id)
    },
   
     },
  created(){
    this.listData();
    let pageRecord = this.$route.query.page||1;//记录上一次页码操作
    let limitRecord = this.$route.query.limit||20;//记录上一次limit操作
    this.wd = this.$route.query.wd||'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='applicationList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
      })
    }
  },
  
}
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>