<template>
    <div class="dashboard-container">
      <p><router-link to="index" class="router-a">首页</router-link>我的预约</p>
      <p><router-link to="addBooking">我要预约</router-link></p>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
      name: 'booking',
      data() {
        return {
          currentRole: 'EditorDashboard'
        }
      },
      computed: {
        ...mapGetters([
          'name',
          'avatar',
          'email',
          'introduction'
        ])
      },
      created() {
        // if (this.roles.indexOf('admin') >= 0) {
        //   return;
        // }
        // const isEditor = this.roles.some(v => v.indexOf('editor') >= 0)
        // if (!isEditor) {
        //   this.currentRole = 'DefaultDashboard';
        // }
        // this.currentRole = 'DefaultDashboard';
      }
    }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container { font-family: '微软雅黑';
  .router-a { padding-right: 8px;}
}
</style>