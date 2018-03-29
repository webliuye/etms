<template>
  <div class="app-wrapper">
     
    <Navbar />
    
    <div class="main-wrapper">
      <div class="sider-wrapper">
        <Sidebar />
      </div>
      <div class="main-container">

        <div style="height: 2000px;"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Navbar, Sidebar } from 'views/layout';
  import store from 'store';

  export default {
    name: 'layout',
    beforeRouteEnter: (to, from, next) => {
      store.dispatch('GetInfo').then((token) => {
          store.dispatch('GetMenu', token).then(() => {
              next();
          });
      }).catch(err => {
        console.log(err);
      });
    },
    components: {
      Navbar,
      Sidebar
    }
  }
</script>
<style rel="stylesheet/less" lang="less" scoped>
@sidebar-width: 180px;
@sidebar-bg: #0080b2;
@scrollbar-bg: #f5f5f5;
.main-wrapper {
  position: absolute;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  >div {
    height: 100%;
    overflow-y: auto
  }
}
.sider-wrapper {
  float: left;
  width: @sidebar-width; 
  background-color: @sidebar-bg;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: @scrollbar-bg;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: @scrollbar-bg;
  }
  &::-webkit-scrollbar-thumb {
    height: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: darken(@sidebar-bg, 5%)
  }
}
.main-container {
  margin-left: @sidebar-width;
  padding: 5px;
  background-color: #e8ebea
}
</style>