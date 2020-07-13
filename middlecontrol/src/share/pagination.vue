<template>
  <div class="block" style="position:fixed;left:250px;bottom:0px;z-index:2000;padding-bottom:10px;background-color:#ffffff;width:100%;">
    <el-pagination
      background
      @size-change="limitChange"
      @current-change="pageChange"
      :current-page="parseInt(page)"
      :page-sizes="[ 20, 40, 60,80]"
      :page-size="parseInt(limit)"
      layout="total,sizes, prev, pager, next,jumper"
      :total="totalNum">
    </el-pagination>
  </div>
</template>

<script>
  import {mapActions,mapState,mapMutations} from 'vuex'
  export default {
    name: "pagination",
    computed:{

    },
    props:['totalNum'],
    inject:['reload','replace'],
    methods: {
      pageChange(val){
        //console.log(val,this.$route)
        console.log(1111)
        //this.$store.dispatch('pagination/getClickPage',val);
        this.replace('page',val)
      },
      limitChange(val){
          //console.log(val)
        console.log(2222)
        this.replace('limit',val);
      }
    },
    data() {
      return {
        page:1,
        limit:20
      }
    },
    created() {
      this.page=this.$route.query.page;
      this.limit=this.$route.query.limit;

    },
    mounted() {

    },
    watch:{
        $route(){
          this.page=this.$route.query.page;
          this.limit=this.$route.query.limit;
        }
    }
  }
</script>

<style scoped>

</style>
