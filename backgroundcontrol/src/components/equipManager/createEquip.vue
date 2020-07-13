<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">创建设备</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑设备</span>
    </div>
    <div style="margin-bottom:100px;">
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="设备号：" prop="code" required>
          <el-input :disabled="isEdit" type="text" v-model="form.code" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="设备型号：" prop="equipmentSpecId">
          <el-select v-model="form.equipmentSpecId" style="width:150px;">
            <el-option v-for="(item,i) in modelList" :key=i :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户列表" v-if="isCreate"> 
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
            <div style="position:absolute;right:-120px;top:0px;width:120px;">已选择<span style="color:#409EFF;">{{tags.length}}</span>个用户</div>
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
        <el-form-item>
          <el-button type="primary" @click="addOrEdit">确定</el-button>
          <el-button @click="$router.push({path:'/equipList',query:JSON.parse($route.query.oldQuery)});">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {addEquip,editEquip,getEquipInfo,modelDropDown,getUserTree} from '../../http/request'
export default {
  name:'createEquip',
  inject:['reload'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      modelList:[],
      form:{
        code:'',
        equipmentSpecId:'',
      },
      rules:{
        code:[{required: true, message: '请输入设备号', trigger: 'change'},{required: true, message: '请输入设备号', trigger: 'blur'}],
        // equipmentSpecId:[{required: true, message: '请选择设备型号', trigger: 'change'},{required: true, message: '请选择设备型号', trigger: 'blur'}],
      },
      departmentId:'',
      zhankai:false,
      treeData:[],
      defaultProps: {
        children: 'list',
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
    dropDown(){//下拉框
      modelDropDown().then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.modelList = res.data;  
        } 
      })
    },
    getTree(){
      getUserTree().then(res=>{
        this.treeData = res.data;
      })
    },
    userInfo(){
      getEquipInfo({"id":parseInt(this.$route.query.id)}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{  
          this.form.code = res.data.code;
          this.form.equipmentSpecId = res.data.equipmentSpecId;
        }
      })
    },
    addOrEdit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.isCreate){
            addEquip({...this.form,"saasCodes":this.tags.map(v=>v.saasCode)}).then(res=>{
              this.$router.push({path:'/equipList',query:JSON.parse(this.$route.query.oldQuery)});
              this.reload();
            })
          }else if(this.isEdit){
            editEquip({
              "id":parseInt(this.$route.query.id),
              "code":this.form.code,
              "equipmentSpecId":this.form.equipmentSpecId,
            }).then(res=>{
              this.$router.push({path:'/equipList',query:JSON.parse(this.$route.query.oldQuery)});
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