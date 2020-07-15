import http from '../http'
import {loadRequest} from '../util' //loading遮罩层
import { Message,Loading } from 'element-ui';
const login = (msg) => {
    return http.post('/api/remote/control/access/login', msg)
  }
/* 获取验证码h */
const getCode = () => {
    return http.get('/api/recorded/access/getIdentifyCode')
  }
/** 用户管理-用户列表 Author:minggui*/
export function getUserList(params){
  let pageNum = params.pageNum||1;
  let pageSize = params.pageSize||20;
  let status = params.status||'';
  let searchText = params.searchText||'';
  let userGroupId = params.userGroupId||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/middleground/admin/page',{pageNum,pageSize,status,searchText,userGroupId}).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 用户管理-用户组下拉 Author:minggui*/
export function userDropDown(){
  return new Promise((resolve,reject)=>{
    http.get('/api/remote/control/userGroup/list').then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 用户管理-启用禁用 Author:minggui*/
export function setStatus(params){
  return http.post('/api/remote/control/middleground/admin/batchSetStatus',params)
}
/** 用户管理-重置密码 Author:minggui*/
export function resetPassword(params){
  return loadRequest('/api/remote/control/middleground/admin/resetPassword',params,'重置密码',http,'get')
}
/** 用户管理-添加用户 Author:minggui*/
export function addUser(params){
    return loadRequest('/api/remote/control/middleground/admin/add',params,'添加',http,'post')
}
/** 用户管理-编辑用户 Author:minggui*/
export function editUser(params){
  return loadRequest('/api/remote/control/middleground/admin/update',params,'修改',http,'post')
}
/** 用户管理-获取用户信息 Author:minggui*/
export function getUserInfo(params){
  return http.get('/api/remote/control/middleground/admin/info',params)
}
/** 用户管理-用户选择应用列表 Author:minggui*/
export function selectAppList(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/remote/control/middleground/admin/appList',params).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 用户管理-删除用户应用 Author:minggui*/
export function delApp(params){
  return http.post('/api/remote/control/middleground/admin/updateAppList',params)
}
/** 用户管理-应用树 Author:minggui*/
export function getAppTree(){
  return new Promise((resolve,reject)=>{
    http.get('/api/remote/control/application/applicationTree').then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 设备型号管理-型号列表 Author:minggui*/
export function getmodelList(params){
  let pageNum = params.pageNum||1;
  let pageSize = params.pageSize||20;
  let name = params.name||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/equipment/spec/page',{pageNum,pageSize,name}).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 设备型号管理-创建设备型号 Author:minggui*/
export function addModel(params){
  return http.post('/api/remote/control/equipment/spec/add',params)
}
/** 设备型号管理-编辑设备型号 Author:minggui*/
export function editModel(params){
  return http.post('/api/remote/control/equipment/spec/update',params)
}
/** 设备型号管理-删除设备型号 Author:minggui*/
export function delModel(params){
  let notice;
  let ids = params.ids;
  if(params.isBatch){
    notice = '删除所选';
  }else{
    notice = '删除';
  }
  return loadRequest('/api/remote/control/equipment/spec/batchDelete',{ids},notice,http,'post')
}
/** 设备管理-设备列表 Author:minggui*/
export function getEquipList(params){
  let pageNum = params.pageNum||1;
  let pageSize = params.pageSize||20;
  let searchText = params.searchText||'';
  let status = params.status||'';
  let equipmentSpecId = params.equipmentSpecId||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/equipment/page',{pageNum,pageSize,searchText,status,equipmentSpecId}).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 设备管理-删除设备 Author:minggui*/
export function delEquip(params){
  let notice;
  let ids = params.ids;
  if(params.isBatch){
    notice = '删除所选';
  }else{
    notice = '删除';
  }
  return loadRequest('/api/remote/control/equipment/batchDelete',{ids},notice,http,'post')
}
/** 设备管理-设备的用户列表 Author:minggui*/
export function equipUserList(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/remote/control/equipment/listUser',params).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 设备管理-获取拉流地址 Author:minggui*/
export function getVideoUrl(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/remote/control/equipment/getLivePullAddress',params).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 设备管理-设备型号下拉 Author:minggui*/
export function modelDropDown(){
  return http.get('/api/remote/control/equipment/spec/list')
}
/** 设备管理-用户树 Author:minggui*/
export function getUserTree(){
  return new Promise((resolve,reject)=>{
    http.get('/api/remote/control/middleground/admin/userTree').then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 设备管理-删除设备用户 Author:minggui*/
export function delEquipUser(params){
  return http.post('/api/remote/control/equipment/updateUserList',params)
}
/** 设备管理-获取设备信息 Author:minggui*/
export function getEquipInfo(params){
  return http.get('/api/remote/control/equipment/info',params)
}
/** 设备管理-添加设备 Author:minggui*/
export function addEquip(params){
  return loadRequest('/api/remote/control/equipment/add',params,'创建',http,'post')
}
/** 设备管理-编辑设备 Author:minggui*/
export function editEquip(params){
  return loadRequest('/api/remote/control/equipment/update',params,'修改',http,'post')
}
/** 用户基本信息-获取当前基本信息 Author:minggui */
export function getBasicInfo () {
  return http.get('/api/remote/control/user/current')
}
/** 用户基本信息-编辑资料 Author:minggui */
export function editInfomation (params) {
  return loadRequest('/api/remote/control/user/update', params, '修改', http, 'post')
}
/** 用户基本信息-修改密码 Author:minggui */
export function editPassword (params) {
  return loadRequest('/api/remote/control/user/modifyPassword', params, '修改密码', http, 'post')
}
/** 应用管理 -  列表 w*/
export function applicationList(params){
  let name=params.wd||'';
  let pageNum = parseInt(params.page)||1;
  let pageSize = parseInt(params.limit)||20;
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/application/page',{pageNum,pageSize,name}).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
 /**应用管理 -  删除 w*/
 export function applicationDel(params) {
  return loadRequest('/api/remote/control/application/batchDelete', params, '删除', http, 'post')
}

 /**应用管理 -  新增 w*/
 export function applicationAdd(params) {
  return loadRequest('/api/remote/control/application/add', params, '保存', http, 'post')
}

 /**应用管理 -  更新 w*/
 export function applicationEdit(params) {
  return loadRequest('/api/remote/control/application/update', params, '保存', http, 'post')
}
/**应用管理 -  应用详情 w*/
export function applicationInfo(params) {
  return http.get('/api/remote/control/application/info', params)
}
/**应用管理 -  应用类型 w*/
export function applicationType(params) {
  return http.get('/api/remote/control/application/listApplicationType', params)
}
/**应用管理 -  服务类型 w*/
export function listServiceType(params) {
  return http.get('/api/remote/control/application/listServiceType', params)
}
/*用户组列表*/
const getGroupList=(msg)=>{
    return http.post('/api/remote/control/userGroup/page',msg)
}
/*添加用户组*/
const addGroup=(msg)=>{
  return http.post('/api/remote/control/userGroup/add',msg)
}
/*编辑用户组*/
const updateGroup=(msg)=>{
  return http.post('/api/remote/control/userGroup/update',msg)
}
/*启用禁用*/
const setGroup=(msg)=>{
  return http.get('/api/remote/control/userGroup/setStatus',msg)
}
/*用户组信息*/
const getGroup=(id)=>{
  return http.get('/api/remote/control/userGroup/info',id)
}
/*删除用户组*/
const deleteGroup=(id)=>{
  return loadRequest('/api/remote/control/userGroup/delete',id,'删除',http,'get')
}
/*获取个人信息*/
const  getSelfMsg=()=>{
  return http.get('/api/remote/control/user/current')
}
/*获取统计信息*/
const getFirst=()=>{
  return http.get('/api/remote/control/user/home')
}
/*修改用户信息*/
const reviseSelf=(msg)=>{
  return http.post('/api/remote/control/user/update',msg)
}

/** sdk管理  -  列表 w*/
export function sdkList(params){
  let pageNum = parseInt(params.page)||1;
  let pageSize = parseInt(params.limit)||20;
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/sdk/page',{pageNum,pageSize}).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}

 /**sdk管理 -  删除 w*/
 export function sdkDel(params) {
  return loadRequest('/api/remote/control/sdk/delete', params, '删除', http, 'get')
}

 /**sdk管理 -  新增 w*/
 export function sdkAdd(params) {
  return loadRequest('/api/remote/control/sdk/add', params, '保存', http, 'post')
}

 /**sdk管理 -  更新 w*/
 export function sdkEdit(params) {
  return loadRequest('/api/remote/control/sdk/update', params, '保存', http, 'post')
}
/**sdk管理 -  应用详情 w*/
export function sdkInfo(params) {
  return http.get('/api/remote/control/sdk/info', params)
}


/** 监控列表  w*/
export function getControlList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let appName = params.wd||'';
  let status = params.status||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/monitor/page',{pageNum,pageSize,appName,status}).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}

/** 监控历史列表 　 w*/
export function getControlHistoryList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let appName = params.wd||'';
  let code = params.q||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/monitor/history/page',{pageNum,pageSize,appName,code}).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}

/** 设备管理-获取拉流地址 w*/
export function getViewUrl(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/remote/control/monitor/view',params).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}

 /**删除监控历史 　 -  删除 w*/
 export function historyDelete(params) {
  return loadRequest('/api/remote/control/monitor/history/delete', params, '删除', http, 'get')
}


export {
    login,
    getCode,
    getGroupList,
    addGroup,
    updateGroup,
    setGroup,
    getGroup,
    deleteGroup,
    getSelfMsg,
    getFirst,
    reviseSelf
}
