<template>
  <div>
    <div v-if="$route.name=='modelList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">设备型号</span>
        <el-button style="float:right;" type="primary" @click="showCreateModel=true;">创建型号</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span class="myWords">
          <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入设备型号"></el-input>
        </span>
        <el-button type="danger" @click="lotDel">批量删除</el-button>
      </el-row>
      <el-table ref="userRef" :data="modelTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" @select="appSelect" @select-all="appSelectAll">
        <el-table-column type="selection" width="50" ></el-table-column>
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="设备型号" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showCreateModel=true;editId=scope.row.id;form.modelName=scope.row.name;">编辑</el-button>
            <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination v-if="showPagination"></pagination>
      </div>
      <el-dialog :title="`${editId?'编辑':'创建'}型号`" :visible.sync="showCreateModel" destroy-on-close @close="closeDialog" width="550px" center>
        <el-form ref="form" label-width="120px" :model="form" :rules="rules">
          <el-form-item label="设备型号：" prop="modelName">
            <el-input v-model="form.modelName" style="width:200px;" maxlength="50"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button :disabled="isConfirm" type="primary" @click="createModel">{{isConfirm&&editId?'编辑中...':isConfirm&&!editId?'创建中...':'确 定'}}</el-button>
          <el-button @click="showCreateModel = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import pagination from '../../share/pagination'
import {getmodelList,addModel,editModel,delModel} from '../../http/request'
export default {
  name:'modelList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      modelTable:[],
      showPagination:false,
      tableHeight:0,
      appIdList:[],
      showCreateModel:false,
      form:{
        modelName:'',
      },
      rules:{
        modelName:[{required: true, message: '请输入设备型号', trigger: 'change'},{required: true, message: '请输入设备型号', trigger: 'blur'}],
      },
      isConfirm:false,
      editId:'',
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
      this.replace('name',this.inputX);
      this.appIdList=[];//清空选择
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='modelList'){
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
        this.appIdList=this.appIdList.filter(v=>this.modelTable.map(v=>v.id).indexOf(v)==-1);
      }
    },
    clashAPP(){//将选择行的勾上
      let selectAllRow=[];
      for(let i=0;i<this.appIdList.length;i++){
        var row=this.modelTable.find(v=>v.id==this.appIdList[i]);
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
    del(id){
      delModel({"ids":[id],"isBatch":false}).then(res=>{
        if(this.modelTable.length==1){
          this.replace('pageNum',1);
        }else{
          this.reload();
        }
      })
    },
    lotDel(){
      if(this.appIdList.length){
        delModel({"ids":this.appIdList,"isBatch":true}).then(res=>{
          this.replace('pageNum',1);
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要删除的型号');
      }
    },
    closeDialog(){
      this.form.modelName='';
      this.editId='';
    },
    createModel(){//创建型号
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isConfirm=true;
          if(this.editId){
            editModel({'id':this.editId,'name':this.form.modelName}).then(res=>{
              this.isConfirm = false;
              if(res.code){
                this.$message.error(res.msg);
              }else{
                this.$message.success(res.msg);
                this.showCreateModel = false;
                this.reload();
              }
            }).catch(err=>{
              this.isConfirm = false;
            })
          }else{
            addModel({'name':this.form.modelName}).then(res=>{
              this.isConfirm = false;
              if(res.code){
                this.$message.error(res.msg);
              }else{
                this.$message.success(res.msg);
                this.showCreateModel = false;
                this.reload();
              }
            }).catch(err=>{
              this.isConfirm = false;
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      }); 
    },
    listData(){
      getmodelList(this.$route.query).then(res=>{
        this.modelTable=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
        this.clashAPP();
      })
    },
  },
  created(){
    this.listData();
    let pageRecord = this.$route.query.pageNum||1;//记录上一次页码操作
    let limitRecord = this.$route.query.pageSize||20;//记录上一次limit操作
    this.inputX = this.$route.query.name||'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='modelList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>