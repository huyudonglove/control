import http from '../http'
import {loadRequest} from '../util' //loading遮罩层
import { Message,Loading } from 'element-ui';
const login=(msg)=>{
    return http.post('/api/recorded/access/login', msg)
}

/* 获取验证码h */
const getCode = () => {
    return http.get('/api/recorded/access/getIdentifyCode')
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
/** 系统管理-用户管理-用户列表 Author:minggui*/
export function getUserTable(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let userName = params.userName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/user/page',{pageNum,pageSize,userName}).then(res=>{
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
/** 系统管理-用户管理-重置密码 Author:minggui*/
export function resetSystemPassword(params){
  return loadRequest('/api/remote/control/user/resetPassword',params,'重置密码',http,'get')
}
/** 系统管理-用户管理-删除用户 Author:minggui*/
export function delSystemUser(params){
  return loadRequest('/api/remote/control/user/delete',params,'删除',http,'get')
}
/** 系统管理-用户管理-添加用户 Author:minggui*/
export function addSystemUser(params){
  return loadRequest('/api/remote/control/user/add',params,'添加',http,'post')
}
/** 系统管理-用户管理-编辑用户 Author:minggui*/
export function editSystemUser(params){
  return loadRequest('/api/remote/control/user/updateUser',params,'修改',http,'post')
}
/** 系统管理-用户管理-获取用户信息 Author:minggui*/
export function getSystemUserInfo(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/remote/control/user/info',params).then(res=>{
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
/** 系统管理-用户管理-角色下拉 Author:minggui*/
export function roleDropDown(){
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/role/page').then(res=>{
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
/** 系统管理-获取当前用户权限 Author:minggui*/
export function currentUserPower(){
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/user/userPermission').then(res=>{
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
/** 系统管理-角色管理-角色列表 Author:minggui*/
export function getRoleList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let roleName = params.roleName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/role/page',{pageNum,pageSize,roleName}).then(res=>{
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
/** 系统管理-角色管理-删除角色 Author:minggui*/
export function delRole(params){
  return loadRequest('/api/remote/control/role/delete',params,'删除',http,'get')
}
/** 系统管理-角色管理-添加角色 Author:minggui*/
export function addRole(params){
  return loadRequest('/api/remote/control/role/add',params,'添加',http,'post')
}
/** 系统管理-角色管理-编辑角色 Author:minggui*/
export function editRole(params){
  return loadRequest('/api/remote/control/role/update',params,'修改',http,'post')
}
/** 系统管理-角色管理-获取角色信息 Author:minggui*/
export function getRoleInfo(params){
  return http.get('/api/remote/control/role/info',params)
}
/** 系统管理-角色管理-获取权限树 Author:minggui*/
export function getRoleTree(){
  return http.post('/api/remote/control/role/treeMenuPermission')
}
/** 设备管理-设备列表 Author:minggui*/
export function getEquipTable(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let status = params.status||'';
  let searchText = params.searchText||'';
  let equipmentSpecId=params.equipmentSpecId||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/equipment/page',{pageNum,pageSize,status,searchText,equipmentSpecId}).then(res=>{
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
/** 应用管理-应用列表 Author:minggui*/
export function getAppList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  return new Promise((resolve,reject)=>{
    http.post('/api/remote/control/application/page',{pageNum,pageSize}).then(res=>{
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
/** 应用管理-sdk下载-sdk列表 Author:minggui*/
export function getSdkList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
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
/** 应用管理-sdk下载-统计sdk下载次数 Author:minggui*/
export function addDownloadCount(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/remote/control/sdk/addDownloadCount',params).then(res=>{
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
/** 监控平台-监控列表 w*/
export function getEquipList(params){
    let pageNum = params.page||1;
    let pageSize = params.limit||20;
    // let searchText = params.searchText||'';
    let status = params.status||'';
    let equipmentName = params.searchText||'';
    let appName=params.appKey||'';
    let monitorStatus=params.monitorStatus	||'';
    return new Promise((resolve,reject)=>{
      http.post('/api/remote/control/monitor/page',{pageNum,pageSize,status,equipmentName,appName,monitorStatus}).then(res=>{
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

  /** 监控平台-监控列表-设备型号下拉 w*/
export function modelDropDown(){
    return http.get('/api/remote/control/equipment/spec/list')
  }

 /** 监控平台-监控列表-应用名称 w*/
 export function applicationDropDown(){
    return http.get('/api/remote/control/application/listApplication')
  }

/** 设备管理-获取拉流地址 w*/
export function getVideoUrl(params){
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
/** 用户管理-用户选择应用列表 Author:minggui*/
export function appType() {
  return http.get('/api/remote/control/application/listApplicationType')
}
/*获取用户信息*/
const getSelfMsg=()=>{
  return http.get('/api/remote/control/user/current')
}
/*修改用户信息*/
const reviseSelf=(msg)=>{
  return http.post('/api/remote/control/user/update',msg)
}
/*首页数据*/
const getFirst=()=>{
  return http.get('/api/remote/control/user/home')
}
/*退出监控*/
const unableMonitor=(id)=>{
  return http.get('/api/remote/control/monitor/unableMonitor',{id:id})
}
/*定时发送监控状态 */
const sendMonitorStatus=(id)=>{
  return http.get('/api/remote/control/monitor/sendMonitorStatus',{id:id})
}
/*发起远程控制*/
const sendControlToApp=(id,type)=>{
  return http.get('/api/remote/control/monitor/sendControlToApp',{id:id,serviceType:type})
  //return loadRequest('/api/remote/control/monitor/sendControlToApp',{id:id,serviceType:type},name,http,'get')
}
/*获取回复*/
const getAppReply=(id)=>{
  return http.get('/api/remote/control/monitor/getAppReply',{id:id,serviceType:1})
}
/*发送坐标信息到app*/
const sendPositionInfo=(params)=>{
  return http.post('/api/remote/control/monitor/sendPositionInfo',params)
}
/*获取推流地址*/
const enableMonitor=(id)=>{
  return http.get('/api/remote/control/monitor/enableMonitor',{id:id})
}
export {
    login,
    getCode,
    getSelfMsg,
    reviseSelf,
    getFirst,
    unableMonitor,
    sendMonitorStatus,
    sendControlToApp,
    getAppReply,
    sendPositionInfo,
    enableMonitor
}
