<template>
  <div v-if="sdkPower.length">
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">SDK下载</span>
    </div>
    <div v-if="sdkPower[0].isCheck">
      <el-table ref="sdkRef" border :data="sdkTable" tooltip-effect="dark" :max-height="tableHeight">
        <el-table-column label="SDK名称" prop="name" align="center"></el-table-column>
        <el-table-column label="版本号" prop="version" align="center"></el-table-column>
        <el-table-column label="更新日志" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showDialog(scope.row.updateMsg)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="download(scope.row,'sdkFileId','sdkFileName')">点击下载</el-button>
            <el-button type="text" @click="download(scope.row,'sdkDocId','sdkDocName')">下载文档</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination :totalNum="total"></pagination>
      </div>
      <el-dialog title="更新日志" :visible.sync="showUpdateMsg" destroy-on-close @close="closeDialog" width="500px" center>
        <div style="white-space:pre-wrap;">{{updateMsg}}</div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {getSdkList,addDownloadCount} from '../../http/request'
import {Base64} from 'js-base64'
import pagination from '../../share/pagination'
import { mapState } from "vuex";
export default {
  name:'sdkList',
  components:{
    pagination,
  },
  data(){
    return{
      sdkTable:[],
      total:0,
      tableHeight:0,
      showUpdateMsg:false,
      updateMsg:''
    }
  },
  watch:{
    $route(){//判断路由query变化执行请求
      this.listData();
    }
  },
  computed:{
    ...mapState('currentUserPower',{sdkPower:'sdkPower'}),
  },
  methods:{
    download(row,myProperty,fileName){
      let decodeUrl=`/static/${Base64.decode(row[myProperty])}`;
      let aTag = document.createElement('a');
      // if(fileName=='name'){
      //   let pathArr = decodeUrl.split('/');
      //   let nameArr = pathArr[pathArr.length-1].split('.')
      //   aTag.download = row[fileName]+'.'+nameArr[nameArr.length-1];
      // }else{
        aTag.download =row[fileName];
      // }
      aTag.href = decodeUrl;
      aTag.click();
      if(fileName=='sdkFileName'){
        addDownloadCount({"id":row.id}).then(res=>{});
      }
    },
    showDialog(msg){
      this.updateMsg = msg;
      this.showUpdateMsg = true;
    },
    closeDialog(){

    },
    listData(){
      getSdkList(this.$route.query).then(res=>{
        this.sdkTable = res.data.items;
        this.total = res.data.total;
      })
    }
  },
  created(){
    this.listData();
  },
  updated(){
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.sdkRef.$el.offsetTop - 110;
    })
  }
}
</script>
<style scoped>

</style>