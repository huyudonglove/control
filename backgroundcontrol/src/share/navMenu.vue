<template>
  <div>
    <!-- 一级菜单 -->
    <template v-for="item in menus"  >
      <el-submenu v-if="item.childs && item.childs.length" :index="item.url" :key="item.url"  ref="myMenu">
        <template slot="title">
          <span>{{item.menuName}}</span>
        </template>
        <!-- 二级菜单 -->
        <template v-for="itemChild in item.childs">
          <el-submenu v-if="itemChild.childs && itemChild.childs.length" :index="itemChild.url" :key="itemChild.url">
            <template slot="title">
              <span>{{itemChild.menuName}}</span>
            </template>
            <!-- 三级菜单 -->
            <el-menu-item v-for="itemChild_Child in itemChild.childs" :index="itemChild_Child.url" :key="itemChild_Child.url">

              <span slot="title">{{itemChild_Child.menuName}}</span>
            </el-menu-item>
          </el-submenu>

          <el-menu-item v-else :index="itemChild.url" :key="itemChild.url">
            <span slot="title">{{itemChild.menuName}}</span>
          </el-menu-item>
        </template>
      </el-submenu>

      <el-menu-item v-else :index="item.url" :key="item.url">

        <span slot="title">{{item.menuName}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'navMenu',
  props: ['menus'],
  data () {
    return {

    }
  },
  methods: {

  },
  updated () {
    this.$nextTick(() => {
      this.menuHeight = window.innerHeight - this.$refs.myMenu.offsetTop - 60
    })
  }

}
</script>

<style scoped>
/* .el-menu .el-menu-item:first-child{
  background-color: #F0F0F0;
  border-radius: 10px 10px 0px 0px;
  border-bottom: 1px solid rgba(223,220,220,1);
} */

/* .el-menu .el-menu-item{
  width: 100%;
  background-color: #F0F0F0;
  border-bottom: 1px solid rgba(223,220,220,1);
} */
/* .el-menu-vertical-demo>div>.el-menu-item{
  background-color: #FFF;
  border-bottom:none;
} */
/* .el-menu .el-menu-item:last-child{
  background-color: #F0F0F0;
  border-radius: 0px 0px 10px 10px;
} */
</style>
