<template>
  <div>
    <el-dialog title="应用列表" :visible.sync="dialogVisible" @close="close" width="80%">
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:0 0 15px 0;">
        <el-button type="primary" @click="addShow=true;">添加应用</el-button>
        <el-button type="danger" @click="lotDel">批量删除</el-button>
      </el-row>
      <el-table ref="multipleTable" :data="applicationList.slice((playPage - 1) * playLimit, playPage * playLimit)" border style="width: 100%" class="mt15 mb15" @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
        <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
        <el-table-column prop="logo" label="应用logo" width="100" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl?`/static/${scope.row.imgUrl}`:''" alt="" style="width:70px;height:70px;" v-focus>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="应用名称" align="center"></el-table-column>
        <el-table-column prop="typeId" label="所属分类" align="center">
          <template slot-scope="scope">
            <span>{{typeList.length?typeList.find(v=>v.id==scope.row.typeId).name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="appSizeChange"
        @current-change="appCurrentChange"
        :current-page="playPage"
        :page-sizes="[ 20, 40, 60,80]"
        :page-size="playLimit"
        layout="total,sizes, prev, pager, next,jumper"
        :total="playTotal?playTotal:0">
      </el-pagination>
    </el-dialog>
    <el-dialog title="添加应用" :visible.sync="addShow" @close="addClose" width="30%" center>
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
        <div style="position:absolute;right:-120px;top:10px;width:120px;">已选择<span style="color:#409EFF;">{{tags.length}}</span>款应用</div>
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
import {selectAppList,delApp,getAppTree,applicationType} from '../../http/request'
import { Base64 } from 'js-base64';
export default {
  name:'appDialog',
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
        children: 'app',
        label: 'name'
      },
      tags:[],
      filterText:'',
      typeList:[],
      playPage:1,
      playLimit:20,
      playTotal:0,
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
    appSizeChange(value){
      this.playLimit = value;
    },
    appCurrentChange(value){
      this.playPage = value;
    },
    addClose(){
      this.tags = [];
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    checkClick(arr,all){
      if(all.checkedNodes.length){
        let newTags = all.checkedNodes.filter(v=>!Boolean(v.app)&&v.name.indexOf(this.filterText)!==-1);
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
        let appIds = this.applicationList.map(v=>v.id).filter(del=>del!=appId);
        delApp({"id":this.userId,appIds}).then(res=>{
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
        this.$message.error('请勾选需要删除的应用');
        return;
      }
      this.$confirm('确认删除所选吗？').then(()=>{
        let appIds = this.applicationList.map(v=>v.id).filter(item=>{
          return this.delArr.indexOf(item) == -1;
        });
        delApp({"id":this.userId,appIds}).then(res=>{
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
        this.$message.error('请选择需要添加的应用');
        return;
      }
      this.$confirm('确认添加吗？').then(()=>{
        this.isConfirm=true;
        let appIds = this.tags.map(v=>v.id);
        appIds = Array.from(new Set(appIds.concat(appIds,this.applicationList.map(u=>u.id))));
        delApp({"id":this.userId,appIds}).then(res=>{
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
    getType(){
      applicationType().then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.typeList = res.data;
        }
      })
    },
    getTree(){
      getAppTree().then(res=>{
        this.treeData = res.data;
      })
    },
    getList(){
      selectAppList(this.allParams).then(res=>{
        this.playTotal=res.data?res.data.length:0;
        this.applicationList=res.data?res.data.map(v=>{
            v.logo?v.imgUrl=Base64.decode(v.logo):null;
            return v;
          }):[];
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
    this.getType();
  }
}
</script>

<style scoped>

</style>
