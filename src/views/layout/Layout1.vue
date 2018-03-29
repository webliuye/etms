<template>
    <div>
        <div class="mainContainer">
           <layout>
            <router-view :key="key"></router-view>
           </layout>
        </div>
    </div>
</template>

<script>
    import { AppMain } from 'views/layout';
    import  layout  from 'views/sourceIndex/layout';
    import router from 'router';
     import store from 'store';
    export default {
      name: 'layout1',
      components: {
        AppMain , layout
      },
       computed: {
        key() {
          return this.$route.name !== undefined
                        ? this.$route.name + new Date()
                        : this.$route + new Date()
        }
      },
      beforeRouteEnter: (to, from, next) => {
         if(JSON.parse(localStorage.getItem('ObjAPI')).state){
          next();
        }else{
            window.location.href = store.getters.objApi.IPORTAL_API+'/login.html';
        }
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
        padding-left: 180px;
        &.hideSidebar {
            padding-left: 40px;
            .sidebar-wrapper {
                transform: translate(-140px, 0);
                .sidebar-container {
                    transform: translate(132px, 0);
                }
                &:hover {
                    transform: translate(0, 0);
                     z-index: 1001;
                    .sidebar-container {
                        transform: translate(0, 0);
                    }
                }
            }
        }
        .sidebar-wrapper {
            width: 180px;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 2;
            overflow-x: hidden;
            transition: all .28s ease-out;
            @include scrollBar;
        }
        .sidebar-container {
            transition: all .28s ease-out;
        }
        .mainContainer {
            width: 100%;
            min-height: 100%;
            transition: all .28s ease-out;
        }
    }
</style>
