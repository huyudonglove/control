import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import login from '@/components/log/login'
import logout from  '@/components/log/logout'
import firstPage from '@/components/firstPage'
import version from '@/components/version'
import aliplayer from '@/components/VueAliplayerV2'
import vueFlv from '../components/vueFlv'
import watchFlv from  '../components/watchFlv'
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
        },
        {
          path: '/userTable',
          name: 'userTable',
          component: () => import('@/components/system/userTable')
        },
        {
          path: '/addUser',
          name: 'addUser',
          component: () => import('@/components/system/addUser')
        },
        {
          path: '/roleList',
          name: 'roleList',
          component: () => import('@/components/system/roleList')
        },
        {
          path: '/createRole',
          name: 'createRole',
          component: () => import('@/components/system/createRole')
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
          path: '/appList',
          name: 'appList',
          component: () => import('@/components/app/appList')
        },
        {
          path: '/appDetails',
          name: 'appDetails',
          component: () => import('@/components/app/appDetails')
        },
        {
          path: '/sdkList',
          name: 'sdkList',
          component: () => import('@/components/sdk/sdkList')
        },
        {
          path: '/controlList',
          name: 'controlList',
          component: () => { return import('@/components/controlSystem/controlList') }
        },
        {
          path:'/firstPage',
          name:'firstPage',
          component:firstPage
        }
      ],

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
      component:version
    },
    {
    path: '/aliplayer',
    name: 'aliplayer',
    component: aliplayer

    },
    {
      path:'/vueFlv',
      name:'vueFlv',
      component:vueFlv
    },
    {
      path:'/watchFlv',
      name:'watchFlv',
      component:watchFlv
    }
  ]
})
