<template>
  <div class="header-wrapper">
    <div class="header-title">
      <h1>{{headerTitle}}</h1>
    </div>
    <div class="header-info">
      <span class="user-name">用户昵称:{{username}}</span>
      <span class="logout" @click="logout">退出</span>
    </div>
  </div>
</template>

<script>
  import store from '../../store';
  export default {
    name: 'navbar',
    data() {
      return {
        headerTitle: '广西区中小实验教学管理平台',
        username: '用户昵称'
      }
    },
    methods: {
      logout() {
        this.$confirm('退出登录操作，请确认是否继续。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('LogOut').then(() => {
               this.$router.push({ path: '/login' });
          });          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      }
    },
    mounted:function(){
      this.username = 'abc';
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  @header-height: 80px;
  .header-wrapper {
    height: @header-height;
    background: url(../../assets/img/bg-header.jpg) no-repeat left top #fff;
    background-size: 100% 100%;
    overflow: hidden;
    padding: 0 30px;
  }
  .header-title {
    float: left;
  }
  .header-info {
    float: right;
    margin-top: 30px;
    span {
      color: #fff;
      padding-left: 20px;
      margin-right: 20px;
      &.user-name {
        background: url(../../assets/img/icon-user.png) no-repeat left center;
        background-size: 16px 16px;
      }
      &.logout {
        cursor: pointer;
        background: url(../../assets/img/icon-logout.png) no-repeat left center;
        background-size: 16px 16px;
      }
    }
  }
  h1 {
    color: #fff;
    margin: 0;
    line-height: @header-height;
    // font-size: 36px;
  }
</style>



