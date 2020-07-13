<template>
  <div>
    <el-dialog title="用户列表" :visible.sync="dialogVisible" @close="close" width="80%">
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:0 0 15px 0;">
        <el-button type="primary" @click="addShow=true;">添加用户</el-button>
        <el-button type="danger" @click="lotDel">批量删除</el-button>
      </el-row>
      <el-table ref="multipleTable" :data="applicationList" border style="width: 100%" class="mt15 mb15" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" ></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
        <el-table-column prop="equipmentSpecName" label="设备型号" align="center">
          <template slot-scope="scope">
            <span :style="{'color':scope.row.equipmentSpecName?'':'red'}">{{scope.row.equipmentSpecName?scope.row.equipmentSpecName:'/'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="equipmentName" label="设备名称" align="center"></el-table-column>
        <el-table-column prop="userGroupName" label="用户组" width="150" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="添加用户" :visible.sync="addShow" @close="addClose" width="30%" center>
      <div style="margin-bottom:10px;width:80%;position:relative;">
        <div ref="box" class="el-input el-input--suffix is-focus" @click="zhankai=true;">
          <input type="text" v-model="filterText" autocomplete="off" placeholder="请选择" class="el-input__inner" style="height: 40px;" aria-expanded="true">
          <span class="el-input__suffix">
            <span class="el-input__suffix-inner">
              <i class="el-input__icon is-reverse" :class="{'el-icon-arrow-up':zhankai,'el-icon-arrow-down':!zhankai}"></i>
            </span>
          </span>
        </div>
        <div ref="treeBox" v-if="zhankai" style="border:1px solid #DCDFE6;height:160px;width:100%;background-color:#ffffff;overflow:auto;position:absolute;left:0;top:40px;z-index:2000;">
          <el-tree
            ref="myTree"
            :data="treeData"
            default-expand-all
            show-checkbox
            node-key="id"
            @check="checkClick"
            :filter-node-method="filterNode"
            :props="defaultProps">
          </el-tree>
        </div>
        <div style="position:absolute;right:-120px;top:10px;width:120px;">已选择<span style="color:#409EFF;">{{tags.length}}</span>个用户</div>
      </div>
      <div style="margin-bottom:30px;">
        <el-tag
          style="margin-right:10px;margin-bottom:5px;"
          v-for="tag in tags"
          :key="tag.id"
          closable
          @close="handleClose(tag)"
          type="">
          {{tag.name}}
        </el-tag>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isConfirm" @click="add">{{isConfirm?'添加中...':'确 定'}}</el-button>
        <el-button @click="addShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {equipUserList,delEquipUser,getUserTree} from '../../http/request'
export default {
  name:'userDialog',
  props:['userId'],
  data(){
    return{
      dialogVisible:true,
      applicationList:[],
      delArr:[],
      addShow:false,
      zhankai:false,
      treeData:[],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      tags:[],
      filterText:'',
      isConfirm:false
    }
  },
  computed:{
    allParams(){
      return{
        "id":this.userId,
      }
    }
  },
  watch:{
    filterText(val) {
      if(this.$refs.myTree){
        this.$refs.myTree.filter(val);
      }
    }
  },
  methods:{
    addClose(){
      this.tags = [];
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    checkClick(arr,all){
      if(all.checkedNodes.length){
        let newTags = all.checkedNodes.filter(v=>!Boolean(v.list)&&v.name.indexOf(this.filterText)!==-1);
        this.tags = Array.from(new Set(this.tags.concat(this.tags,newTags)));
      }else{
        
      }
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    myClick(event){
      const e = event || window.event;
      if (this.$refs.treeBox && !this.$refs.treeBox.contains(e.target)&&!this.$refs.box.contains(e.target)) {
        this.zhankai = false;
        this.filterText = '';
      }
    },
    handleSelectionChange(arr){
      this.delArr = arr.length?arr.map(v=>v.id):[];
    },
    del(appId){
      this.$confirm('确认删除吗？').then(()=>{
        let userIds = this.applicationList.map(v=>v.id).filter(del=>del!=appId);
        delEquipUser({"id":this.userId,userIds}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.$message.success(res.msg);
            this.getList();
          }
        })
      }).catch(()=>{
        console.log('取消')
      })
    },
    lotDel(){
      if(!this.delArr.length){
        this.$message.error('请勾选需要删除的用户');
        return;
      }
      this.$confirm('确认删除所选吗？').then(()=>{
        let userIds = this.applicationList.map(v=>v.id).filter(item=>{
          return this.delArr.indexOf(item) == -1;
        });
        delEquipUser({"id":this.userId,userIds}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.$message.success(res.msg);
            this.getList();
          }
        })
      }).catch(()=>{
        console.log('取消')
      })
    },
    add(){
      if(!this.tags.length){
        this.$message.error('请选择需要添加的用户');
        return;
      }
      this.$confirm('确认添加吗？').then(()=>{
        this.isConfirm = true;
        let saasCodes = this.tags.map(v=>v.saasCode);
        saasCodes = Array.from(new Set(saasCodes.concat(saasCodes,this.applicationList.map(u=>u.saasCode))));
        delEquipUser({"id":this.userId,saasCodes}).then(res=>{
          this.isConfirm = false;
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.$message.success(res.msg);
            this.addShow=false;
            this.zhankai = false;
            this.tags=[];
            this.getList();
          }
        }).catch(err=>{
          this.isConfirm = false;
        })
      }).catch(()=>{
        console.log('取消')
      })
    },
    close(){
      this.$emit("appDialogClose");
    },
    getTree(){
      getUserTree().then(res=>{
        this.treeData = res.data;
      })
    },
    getList(){
      equipUserList(this.allParams).then(res=>{
        this.applicationList=res.data;
      })
    },
  },
  mounted(){
    document.addEventListener('click',this.myClick)
  },
  destroyed(){
    document.removeEventListener('click',this.myClick)
  },
  created(){
    this.getList();
    this.getTree();
  }
}
</script>

<style scoped>

</style>
