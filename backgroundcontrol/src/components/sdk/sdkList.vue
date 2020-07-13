<template>
  <div>
    <div v-if="$route.name=='sdkList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">SDK版本管理</span>
        <el-button  style="float:right;" type="primary" @click="$router.push({path:'/serviceManage/sdkList/sdkCreate',query:{msg:JSON.stringify($route.query)}})">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight"  >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="SDK名称" align="center"></el-table-column>
        <el-table-column prop="version" label="版本号" align="center"></el-table-column>
        <el-table-column prop="downloadCount" label="下载次数" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center"  width="180"></el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <el-button  type="primary" size="mini" @click="$router.push({path:'/serviceManage/sdkList/sdkCreate',query:{id:scope.row.id,msg:JSON.stringify($route.query)}})">编辑</el-button>
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
import {sdkList,sdkDel} from '../../http/request'
export default {
  name:'sdkList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      tableData:[],
      showPagination:false,
      tableHeight:250,

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
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='sdkList'){
        this.listData();
      }
    }
  },
  methods:{
    listData(){
      sdkList(this.$route.query).then(res=>{
        this.tableData=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
    del(id){
      sdkDel({id:id}).then(res=>{
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
    if(this.$route.name=='sdkList'){
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