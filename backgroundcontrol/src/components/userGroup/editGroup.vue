<template>
    <div>
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="!id">添加用户组</span>
        <span style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="id">编辑用户组</span>
      </div>
      <div>
        <div class="div">
          <span><i style="color: red;padding: 5px">*</i>用户组名称</span>
          <span><el-input v-model="name" style="width: 250px" maxlength="10"></el-input></span>
        </div>
        <div class="div">
          <span><i style="color: red;padding: 5px">*</i>可配置账号数量</span>
          <span><el-input v-model="maxAccount" style="width: 250px" maxlength="10" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"></el-input></span>
        </div>
        <div class="div">
          <span><i style="color: red;padding: 5px"></i><el-checkbox v-model="monitorService" :true-label="1" :false-label="0">监控服务</el-checkbox></span>
        </div>
        <div class="div">
          <span><i style="color: red;padding: 5px"></i>最大监控流数量</span>
          <span><el-input v-model="maxMonitor" :disabled="!monitorService" style="width: 250px" maxlength="10" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"></el-input></span>
        </div>
        <div class="div">
          <span><i style="color: red;padding: 5px"></i><el-checkbox v-model="connectionService" :true-label="1" :false-label="0">对话服务</el-checkbox></span>
        </div>
        <div class="div">
          <span><i style="color: red;padding: 5px"></i>最大对话数量</span>
          <span><el-input v-model="maxConnection" :disabled="!connectionService" style="width: 250px" maxlength="10" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"></el-input></span>
        </div>
        <div class="div">
          <span><i style="color: red;padding: 5px">*</i>状态</span>
          <span>
            <el-select v-model="status" :disabled="!!id" style="width: 250px">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="2"></el-option>
            </el-select>
          </span>
        </div>
        <div style="margin-top: 20px;margin-left: 10px">
          <el-button @click="addGroup" v-if="!id" type="primary">保存</el-button>
          <el-button @click="updateGroup" v-if="id" type="primary">保存</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </div>
      </div>
    </div>
</template>

<script>
  import {addGroup,getGroup,updateGroup} from "../../http/request";

  export default {
        name: "editGroup",
        data(){
          return{
            name:'',
            maxAccount:'',
            monitorService:0,
            connectionService:0,
            maxMonitor:'',
            maxConnection:'',
            status:1,
            id:''
          }
        },
        methods:{
          addGroup(){
            let msg={
              name:this.name,
              maxAccount:this.maxAccount,
              monitorService:this.monitorService,
              connectionService: this.connectionService,
              maxMonitor: this.maxMonitor,
              maxConnection: this.maxConnection,
              status: this.status
            }
            msg.name?(()=>{
              msg.maxAccount?(()=>{
                addGroup(msg).then(v=>{
                  v.code?this.$message.error(v.msg):this.$message.success(v.msg)&&this.$router.go(-1);
                })
              })():this.$message.error('可配置账号数量不能为空');
            })():this.$message.error('用户组名称不能为空');
            console.log(msg,777)
          },
          getGroup(){
            getGroup({id:this.$route.query.id}).then(v=>{
              v.code&&this.$message.error(v.msg);
              !v.code&&(()=>{
                this.name=v.data.name;
                this.maxAccount=v.data.maxAccount;
                this.monitorService=v.data.monitorService;
                this.connectionService=v.data.connectionService;
                this.maxMonitor=v.data.maxMonitor;
                this.maxConnection=v.data.maxConnection;
                this.status=v.data.status;
              })();
            })
          },
          updateGroup(){
            let msg={
              id:this.id,
              name:this.name,
              maxAccount:this.maxAccount,
              monitorService:this.monitorService,
              connectionService: this.connectionService,
              maxMonitor: this.maxMonitor,
              maxConnection: this.maxConnection,
              status: this.status
            }
            msg.name?(()=>{
              msg.maxAccount?(()=>{
                updateGroup(msg).then(v=>{
                  v.code?this.$message.error(v.msg):this.$message.success(v.msg)&&this.$router.go(-1);
                })
              })():this.$message.error('可配置账号数量不能为空');
            })():this.$message.error('用户组名称不能为空');
          }
        },
        created() {
            this.$route.query.id&&(this.id=this.$route.query.id)&&this.getGroup();
        }
  }
</script>

<style scoped>
.div{
  margin-top: 20px;
  display: flex;
  width: 400px;
  justify-content: space-between;
  line-height: 30px;
}
</style>
