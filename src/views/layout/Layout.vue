<template>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
        <Sidebar class="sidebar-container"/>
        <div class="main-container">
            <Navbar/>
            <App-main/>
        </div>
    </div>
</template>

<script>
    import { Navbar, Sidebar, AppMain } from 'views/layout';
    import { getSecurityBtn} from 'api/index';
    import store from 'store';
    import router from 'router';
    var vm=this;
    export default {
      name: 'layout',
      components: {
        Navbar,
        Sidebar,
        AppMain
      },
      computed: {
        sidebar() {
          return this.$store.state.app.sidebar;
        }
      },
      data() {
        return {
            isIndex:false
        }
      },
      beforeRouteEnter: (to, from, next) => {
        store.dispatch('GetInfo').then(res => {
            if(!res.orgId){
                // next(vm=>{
                //     vm.$message.error('该账户没有开通权限');

                // })
                window.location.href = store.getters.objApi.IPORTAL_API_1;
            }else{
              store.dispatch('GetMenu').then(() => {
                next();
              }).catch(error => {
                window.location.href = store.getters.objApi.IPORTAL_API_1;
              })
            }
        }).catch(err => {
          window.location.href = store.getters.objApi.IPORTAL_API_1;
          console.log(err);
        });
        
      },
      created() {
        var vm = this;
        getSecurityBtn().then(res => {
            if(res && res.length > 0){
               res.forEach(function(item){
                 if(item.name == '预约'){
                  vm.$store.state.commonData.powerBooking = true;
                 }else if(item.name == '安排') {
                  vm.$store.state.commonData.powerArrang = true;
                 }else if(item.name == '公告查看') {
                  vm.$store.state.commonData.powerNotice = true;
                 }else if(item.name == '实验员代登记'){
                  vm.$store.state.commonData.powerLog = true;
                 }else if(item.name == '资源查看'){
                  vm.$store.state.commonData.powerSource = true;
                 }
               });
            }
        });
      },
      mounted(){

      }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";
	.app-wrapper {
	  @include clearfix;
	  position: relative;
	  height: 100%;
	  width: 100%;
  }
  .main-container{
    background: #eee;
  }
  .sidebar-container.scroll-container {
    background: url('../../assets/img/nav-bottom.jpg') center bottom no-repeat #00A0E9;
    position:relative;
  }
</style>
