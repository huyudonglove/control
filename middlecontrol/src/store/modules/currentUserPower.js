import {currentUserPower} from '../../http/request'

const state={
  homePower:[],
  monitorPower:[],
  appPower:[],
  sdkPower:[],
  equipPower:[],
  infoPower:[],
  pswPower:[],
  userPower:[],
  rolePower:[]
};
const mutations={

};
const actions={
  getUserPower({commit}){
    currentUserPower().then(res=>{
      state.homePower = res.data.filter(v=>v.code=='remote:middle:home').length?res.data.filter(v=>v.code=='remote:middle:home')[0].permissionList:[];;//总览
      state.monitorPower = res.data.filter(v=>v.code=='remote:middle:monitor:list').length?res.data.filter(v=>v.code=='remote:middle:monitor:list')[0].permissionList:[];;//监控列表
      state.appPower = res.data.filter(v=>v.code=='remote:middle:app:list').length?res.data.filter(v=>v.code=='remote:middle:app:list')[0].permissionList:[];;//应用管理
      state.sdkPower = res.data.filter(v=>v.code=='remote:middle:app:sdk').length?res.data.filter(v=>v.code=='remote:middle:app:sdk')[0].permissionList:[];;//sdk下载
      state.equipPower = res.data.filter(v=>v.code=='remote:middle:equip:list').length?res.data.filter(v=>v.code=='remote:middle:equip:list')[0].permissionList:[];;//设备列表
      state.infoPower = res.data.filter(v=>v.code=='remote:middle:system:current').length?res.data.filter(v=>v.code=='remote:middle:system:current')[0].permissionList:[];//基本信息管理
      state.pswPower = res.data.filter(v=>v.code=='remote:middle:system:password').length?res.data.filter(v=>v.code=='remote:middle:system:password')[0].permissionList:[];;//修改密码管理
      state.userPower = res.data.filter(v=>v.code=='remote:middle:system:user').length?res.data.filter(v=>v.code=='remote:middle:system:user')[0].permissionList:[];//成员管理
      state.rolePower = res.data.filter(v=>v.code=='remote:middle:system:role').length?res.data.filter(v=>v.code=='remote:middle:system:role')[0].permissionList:[];//角色管理
    })
    console.log(state,99999999)
  }
};
export default {
  namespaced:true,
  state,
  actions,
  mutations
}
