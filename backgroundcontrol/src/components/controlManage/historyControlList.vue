<template>
  <div>
    <div v-if="$route.name=='historyControlList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">历史监控管理</span>
      </div>
       <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
       <span>
          应用名称：
        <el-input v-model.trim="wd" style="width:15%" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入应用名称" @change="replace('page',1);"></el-input>
       </span>
        <span>
          设备号：
        <el-input v-model.trim="q" style="width:15%" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入设备号" @change="replace('page',1);"></el-input>
       </span>
      </el-row>
     <el-table ref="multipleTable" :data="tableData" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight"  >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="appName" label="应用名称" align="center"></el-table-column>
        <el-table-column prop="code" label="设备号" align="center"></el-table-column>
        <!-- <el-table-column prop="equipmentName" label="设备名称" align="center"></el-table-column> -->
        <el-table-column prop="streamStartTime" label="监控开始时间" align="center"  width="180"></el-table-column>
        <el-table-column prop="streamEndTime" label="流结束时间" align="center"  width="180"></el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
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
import {getControlHistoryList,historyDelete} from '../../http/request'
export default {
  name:'historyControlList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      tableData:[],
      showPagination:false,
      tableHeight:250,
      wd:'',
      q:''

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
      this.replace('wd',this.wd);
    },
     q(){
      this.replace('q',this.q);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='historyControlList'){
        this.listData();
      }
    }
  },
  methods:{
    listData(){
      getControlHistoryList(this.$route.query).then(res=>{
        this.tableData=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
    del(id){
      historyDelete({id:id}).then(res=>{
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
   
     },
  created(){
    this.listData();
    let pageRecord = this.$route.query.page||1;//记录上一次页码操作
    let limitRecord = this.$route.query.limit||20;//记录上一次limit操作
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='historyControlList'){
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