<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">应用管理</span>
    </div>
    <el-table ref="appRef" border :data="appTable" tooltip-effect="dark" :max-height="tableHeight">
      <el-table-column label="应用名称" prop="name" align="center"></el-table-column>
      <el-table-column label="所属分类" prop="typeId" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.typeId==1">游戏类</span>
          <span v-if="scope.row.typeId==2">应用类</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="$router.push({path:'/appDetails',query:{myData:JSON.stringify(scope.row)}})">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
        <pagination :totalNum="total"></pagination>
    </div>
  </div>
</template>
<script>
import {getAppList} from '../../http/request'
import pagination from '../../share/pagination'
export default {
  name:'appList',
  components:{
    pagination,
  },
  data(){
    return{
      appTable:[],
      total:0,
      tableHeight:0,
      showUpdateMsg:false,
    }
  },
  watch:{
    $route(){//判断路由query变化执行请求
      this.listData();
    }
  },
  methods:{
    listData(){
      getAppList(this.$route.query).then(res=>{
        this.appTable = res.data.items;
        this.total = res.data.total;
      })
    }
  },
  created(){
    this.listData();
  },
  updated(){
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.appRef.$el.offsetTop - 110;
    })
  }
}
</script>
<style scoped>

</style>