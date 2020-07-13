<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">创建设备</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑设备</span>
    </div>
    <div style="margin-bottom:100px;">
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="设备名称：" prop="equipmentName" required>
          <el-input type="text" v-model="form.equipmentName" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="设备号：" prop="code" required>
          <el-input :disabled="isEdit" type="text" v-model="form.code" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="设备型号：" prop="equipmentSpecId">
          <el-select v-model="form.equipmentSpecId" style="width:150px;">
            <el-option v-for="(item,i) in modelList" :key=i :label="item.name" :value="item.id"></el-option>
          </el-select>
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
        equipmentName:'',
        code:'',
        equipmentSpecId:'',
      },
      rules:{
        equipmentName:[{required: true, message: '请输入设备名称', trigger: 'change'},{required: true, message: '请输入设备名称', trigger: 'blur'}],
        code:[{required: true, message: '请输入设备号', trigger: 'change'},{required: true, message: '请输入设备号', trigger: 'blur'}],
        // equipmentSpecId:[{required: true, message: '请选择设备型号', trigger: 'change'},{required: true, message: '请选择设备型号', trigger: 'blur'}],
      },
      departmentId:'',
    }
  },
  watch:{
    
  },
  methods:{
    dropDown(){//下拉框
      modelDropDown().then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.modelList = res.data;  
        } 
      })
    },
    userInfo(){
      getEquipInfo({"id":parseInt(this.$route.query.id)}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.form.equipmentName = res.data.equipmentName?res.data.equipmentName:''; 
          this.form.code = res.data.code;
          this.form.equipmentSpecId = res.data.equipmentSpecId?res.data.equipmentSpecId:'';
        }
      })
    },
    addOrEdit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.isCreate){
            addEquip({...this.form}).then(res=>{
              this.$router.push({path:'/equipList',query:JSON.parse(this.$route.query.oldQuery)});
              this.reload();
            })
          }else if(this.isEdit){
            editEquip({
              "id":parseInt(this.$route.query.id),
              "equipmentName":this.form.equipmentName,
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
  async created(){
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