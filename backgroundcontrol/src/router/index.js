import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import login from '@/components/log/login'
import groupList from '@/components/userGroup/groupList'
import firstPage from '@/components/firstPage'
import editGroup from '@/components/userGroup/editGroup'
import logout from '@/components/log/logout'
import verson from '@/components/version'
import aliplayer from '@/components/VueAliplayerV2'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      children:[
        {
          path: '/serviceManage',
          name: 'serviceManage',
          component: () => { return import('@/components/serviceManage/serveList') },
          children:[
            {
              path: '/serviceManage/applicationList',
              name: 'applicationList',
              component: () => { return import('@/components/serviceManage/applicationList') },
              children:[
                {
                  path: '/serviceManage/applicationList/applicationCreate',
                  name: 'applicationCreate',
                  component: () => { return import('@/components/serviceManage/applicationCreate') },
                }
              ]
            }
          ]
        },
        {
          path: '/serviceManage/sdkList',
          name: 'sdkList',
          component: () => { return import('@/components/sdk/sdkList') },
          children:[
            {
              path: '/serviceManage/sdkList/sdkCreate',
              name: 'sdkCreate',
              component: () => { return import('@/components/sdk/sdkCreate') },
            }
          ]
        },
        {
          path: '/controlManage/historyControlList',
          name: 'historyControlList',
          component: () => { return import('@/components/controlManage/historyControlList') },
        },
        {
          path: '/controlManage/offlineControlList',
          name: 'offlineControlList',
          component: () => { return import('@/components/controlManage/offlineControlList') },
        },
        {
          path:'/groupList',
          name:'groupList',
          component:groupList,
          children:[]
        },
        {
          path:'/editGroup',
          name:'editGroup',
          component:editGroup
        },
        {
          path:'/firstPage',
          name:'firstPage',
          component:firstPage
        },
        {
          path: '/userList',
          name: 'userList',
          component: () => { return import('@/components/userManager/userList') },
          children: [
            {
              path: '/userList/createUser',
              name: 'createUser',
              component: () => { return import('@/components/userManager/createUser') }
            }
          ]
        },
        {
          path: '/modelList',
          name: 'modelList',
          component: () => { return import('@/components/equipManager/modelList') },
        },
        {
          path: '/equipList',
          name: 'equipList',
          component: () => { return import('@/components/equipManager/equipList') },
          children: [
            {
              path: '/equipList/createEquip',
              name: 'createEquip',
              component: () => { return import('@/components/equipManager/createEquip') }
            }
          ]
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: () => { return import('@/components/system/userInfo') },
          children: [
            {
              path: '/userInfo/editInfo',
              name: 'editInfo',
              component: () => { return import('@/components/system/editInfo') }
            }
          ]
        },
        {
          path: '/modifyPassword',
          name: 'modifyPassword',
          component: () => { return import('@/components/system/modifyPassword') }
        }
      ]
    },
    {
      path: '/aliplayer',
      name: 'aliplayer',
      component: aliplayer
    },
    {
      path:'/vueFlv',
      name:'vueFlv',
      component:()=>import('@/components/vueFlv')
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path:'/logout',
      name:'logout',
      component:logout
    },
    {
      path:'/version',
      name:'version',
      component:verson
    }
  ]
})
