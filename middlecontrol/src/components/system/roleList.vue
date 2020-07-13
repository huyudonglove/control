<template>
  <div v-if="rolePower.length">
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">角色列表</span>
      <el-button :disabled="!rolePower[2].isCheck" style="float:right;" type="primary" @click="$router.push({path:'/createRole'})">添加角色</el-button>
    </div>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
      <span class="myWords">
        角色名称
        <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入角色名称" @change="replace('page',1);"></el-input>
      </span>
    </el-row>
    <el-table ref="roleRef" :data="roleTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight">
      <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="description" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <el-button :disabled="!rolePower[1].isCheck" type="primary" size="mini" @click="$router.push({path:'/createRole',query:{id:scope.row.id}})">编辑</el-button>
          <el-button :disabled="!rolePower[3].isCheck" type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
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
import {getRoleList,delRole} from '../../http/request'
import { mapState } from "vuex";
export default {
  name:'roleList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      roleTable:[],
      totalNum:0,
      tableHeight:0,
    }
  },
  watch:{
    inputX(){
      this.replace('roleName',this.inputX);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='roleList'){
        this.listData();
      }
    }
  },
  computed:{
    ...mapState('currentUserPower',{rolePower:'rolePower'}),
  },
  methods:{
    del(id){
      delRole({id}).then(res=>{
        if(this.roleTable.length==1){
          this.replace('page',1);
        }
        this.reload();
      }) 
    },
    listData(){
      getRoleList(this.$route.query).then(res=>{
        this.roleTable=res.data.items;
        this.totalNum = res.data.total;
      })
    },
  },
  created(){
    this.listData();
    this.inputX = this.$route.query.roleName||'';
  },
  updated(){
    if(this.$route.name=='roleList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.roleRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>