<template>
    <div>
      <div>
        <div style="height:50px;border-bottom:1px solid #DFDCDC;">
          <span style="font-size:24px;font-weight:bold;color:#614a4d;">用户组管理</span>
          <el-button type="primary" style="float: right;" @click="$router.push('/editGroup')">新增</el-button>
        </div>
        <el-table ref="userRef" :data="userTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" >
          <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="用户组名称" align="center"></el-table-column>
          <el-table-column prop="userCount" label="账号数量" align="center"></el-table-column>
          <el-table-column  label="监控服务" align="center">
              <template slot-scope="scope">
                  <span v-if="scope.row.monitorService==1"><img src="../../assets/r.png" alt=""></span>
                  <span v-if="scope.row.monitorService==0"><img src="../../assets/f.png" alt=""></span>
              </template>
          </el-table-column>
          <el-table-column  label="对话服务" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.connectionService==1"><img src="../../assets/r.png" alt=""></span>
              <span v-if="scope.row.connectionService==0"><img src="../../assets/f.png" alt=""></span>
            </template>
          </el-table-column>
          <el-table-column  label="状态" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.status==1">启用</span>
                <span v-if="scope.row.status==2">禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center">

          </el-table-column>
          <el-table-column label="账号状态（启用/禁用）" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="switchChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="$router.push({path:'/editGroup',query:{id:scope.row.id}})">编辑</el-button>
              <el-button type="danger" size="mini"  @click="deleteGroup(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="position:fixed;left:250px;bottom:10px;" v-if="show">
          <el-pagination @size-change="limitChange" @current-change="pageChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
      <div>

      </div>
    </div>
</template>

<script>
  import {getGroupList,deleteGroup,setGroup} from '../../http/request'
    export default {
        name: "groupList",
        data(){
          return{
            tableHeight:0,
            userTable:[],
            total:0,
            currentPage:1,
            limit:40,
            show:false
          }
        },
        inject:['reload','replace'],
        methods:{
          getGroupList(){
            let msg={
              pageNum:this.$route.query.page||1,
              pageSize:this.$route.query.limit||20
            }
            getGroupList(msg).then(v=>{
              console.log(v);
              this.userTable=v.data.items;
              this.total=v.data.total;
            })
          },
          limitChange(val){
            console.log(val);
            this.replace('limit',val);
            this.getGroupList();
          },
          pageChange(val){
            console.log(val);
            this.replace('page',val);
            this.getGroupList();
          },
          switchChange(row){
              console.log(row,777);
            let msg;
            row.status==1?msg='启用':msg='禁用';
            this.$confirm(`确定${msg}吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              setGroup(row).then(v=>{
                v.code?this.$message.error(v.msg)&&this.getGroupList():this.$message.success(v.msg)&&this.getGroupList();
              })
            }).catch(() => {
             this.reload();
            });
          },
          deleteGroup(id){
            deleteGroup({id:id}).then(v=>{
                  this.show=false;
                  this.$nextTick(v=>{
                    this.currentPage=1;
                    this.show=true;
                  })
                  this.pageChange(1);
            });
          }
        },
        created(){
          this.show=true;
          this.currentPage=this.$route.query.page*1||1;
          this.limit=this.$route.query.limit*1||20;
          this.getGroupList();

        },
        updated(){
          if(this.$route.name=='groupList'){
            this.$nextTick(()=>{
              this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
            })
          }
        }
    }
</script>

<style scoped>

</style>
