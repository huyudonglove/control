<template>
    <div></div>
</template>

<script>
    export default {
        name: "logout",
        methods:{
          logout(){
            this.$cookies.get('checked')?(()=>{
              this.$cookies.remove('remoteBackgroundToken')
            })():(()=>{
              this.$cookies.remove('loginName');
              this.$cookies.remove('password');
              this.$cookies.remove('remoteBackgroundToken')
            })();
            this.$router.push('/login')
          }
        },
      created() {
          this.logout();
      }
    }
</script>

<style scoped>

</style>
