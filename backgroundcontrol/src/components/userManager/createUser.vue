<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">添加用户</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑用户</span>
    </div>
    <div>
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="用户名称：" prop="userName" required>
          <el-input type="text" v-model="form.userName" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="所属单位：" prop="departmentName" required>
          <el-input v-model="form.departmentName" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="用户组：" prop="userGroupId" required>
          <el-select v-model="form.userGroupId" style="width:150px;">
            <el-option v-for="(item,i) in userGroupList" :key=i :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别：" prop="sex" required>
          <span class="myWords">
            <el-select v-model="form.sex" style="width:150px;">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </span>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone" required>
          <el-input type="text" :disabled="isEdit" v-model="form.phone" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email" required>
          <el-input type="text" :disabled="isEdit" v-model="form.email" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="" v-if="isCreate">
          <span style="color:red">注：用户可使用手机号或邮箱作为登录帐号，默认密码为：123456</span>
        </el-form-item>
        <el-form-item label="状态：" required>
          <span class="myWords">
            <el-select v-model="form.status" style="width:150px;">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="2"></el-option>
            </el-select>
          </span>
        </el-form-item>
        <el-form-item label="应用列表：" v-if="isCreate"> 
          <div style="margin-bottom:10px;width:300px;position:relative;">
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
            <div style="position:absolute;right:-120px;top:0px;width:120px;">已选择<span style="color:#409EFF;">{{tags.length}}</span>款应用</div>
          </div>
          <div>
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
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            style="width:400px;"
            type="textarea"
            :rows="3"
            show-word-limit
            maxlength="200"
            placeholder="请输入备注"
            v-model="form.remark">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrEdit">确定</el-button>
          <el-button @click="$router.push({path:'/userList',query:JSON.parse($route.query.oldQuery)});">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {addUser,editUser,getUserInfo,userDropDown,getAppTree} from '../../http/request'
export default {
  name:'createUser',
  inject:['reload'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      userGroupList:[],
      form:{
        userName:'',
        departmentName:'',
        userGroupId:'',
        sex:1,
        phone:'',
        email:'',
        status:1,
        remark:''
      },
      rules:{
        userName:[{required: true, message: '请输入用户名称', trigger: 'change'},{required: true, message: '请输入用户名称', trigger: 'blur'}],
        departmentName:[{required: true, message: '请输入所属单位', trigger: 'change'},{required: true, message: '请输入所属单位', trigger: 'blur'}],
        userGroupId:[{required: true, message: '请选择用户组', trigger: 'change'},{required: true, message: '请选择用户组', trigger: 'blur'}],
        phone:[
          {required: true, message: '请输入手机号', trigger: 'change'},
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
        ],
        email:[
          {required: true, message: '请输入邮箱', trigger: 'change'},
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, message: '邮箱格式不正确', trigger: 'blur'}
        ],
      },
      departmentId:'',
      zhankai:false,
      treeData:[],
      defaultProps: {
        children: 'app',
        label: 'name'
      },
      tags:[],
      filterText:'',
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
    dropDown(){//角色下拉框
      userDropDown().then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.userGroupList = res.data;  
        } 
      })
    },
    getTree(){
      getAppTree().then(res=>{
        this.treeData = res.data;
      })
    },
    userInfo(){
      getUserInfo({"id":parseInt(this.$route.query.id)}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{  
          this.form.userName = res.data.userName;
          this.form.departmentName = res.data.departmentName?res.data.departmentName:'';
          this.form.userGroupId = res.data.userGroupId?res.data.userGroupId:'';
          this.form.sex = res.data.sex;
          this.form.phone = res.data.phone?res.data.phone:'';
          this.form.email = res.data.email?res.data.email:'';
          this.form.status = res.data.status;
          this.form.remark = res.data.remark;
          this.departmentId = res.data.departmentId?res.data.departmentId:'';
        }
      })
    },
    addOrEdit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.isCreate){
            addUser({...this.form,"appIds":this.tags.map(v=>v.id)}).then(res=>{
              this.$router.push({path:'/userList',query:JSON.parse(this.$route.query.oldQuery)});
              this.reload();
            })
          }else if(this.isEdit){
            editUser({
              "id":parseInt(this.$route.query.id),
              "userName":this.form.userName,
              "departmentId":this.departmentId,
              "departmentName":this.form.departmentName,
              "userGroupId":this.form.userGroupId,
              "sex":this.form.sex,
              "status":this.form.status,
              "remark":this.form.remark,
            }).then(res=>{
              this.$router.push({path:'/userList',query:JSON.parse(this.$route.query.oldQuery)});
              this.reload();
            })
          } 
        } else {
          console.log('error submit!!');
          return false;
        }
      });   
    },
  },
  mounted(){
    document.addEventListener('click',this.myClick)
  },
  destroyed(){
    document.removeEventListener('click',this.myClick)
  },
  async created(){
    this.getTree();
    this.dropDown();
    if(this.$route.query.id){
      this.isEdit=true;
      this.userInfo();
    }else{
      this.isCreate=true;
    }
  }
}
</script>

<style scoped>

</style>