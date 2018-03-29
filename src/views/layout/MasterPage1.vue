<template>
    <div class="master-page">
        <SrcIndex  v-if="showSrc"></SrcIndex>
        <div v-if="!showSrc">
             <img src="~assets/login-icon/login-header.jpg" style="width:100%;" alt="">
        </div>
        <div class="clearfix">
            <levelbar></levelbar>
        </div>
        <div class="mainContainer" :style="{minHeight:contentHeight}">
            <slot>
            </slot>
        </div>
    </div>
</template>
<script>
    import Levelbar from '../layout/Levelbar1';
    import SrcIndex from "views/sourceIndex/SrcIndex";
    import carsoul from "views/sourceIndex/carsoul";
    export default {
      props: {
          title: {
              type: String,
              default: ''
          }
      },
      components: {
        Levelbar,SrcIndex,carsoul
      },
      data(){
          return{
              contentHeight:'',
              showSrc:false,
              showRank:false
          }

      },
      created(){
          var state=JSON.parse(localStorage.getItem('ObjAPI')).state;
           if(state==1){
              this.showSrc=true;
              this.showRank=true;
            }else if(state==2){
                 this.showSrc=true;
                 this.showRank=false;
            }else  if(state==3){
                 this.showSrc=false;
                 this.showRank=true;
            }
           if (document.documentElement.clientHeight) {
            this.contentHeight = document.documentElement.clientHeight-124 + "px";
           } else {
             this.contentHeight = document.body.clientHeight-124 + "px";
           }
      }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    @base-bg: #00A0E9;
    .master-page {
        background-color: #ececec;
        width:100%;
        min-height: 100%;
        .clearfix{
            width:1024px;margin:0 auto;
            padding:8px 16px;
        }
        .mainContainer {
            width:1024px;
            margin:0 auto;
            background-color: #FFF;
            border: 1px solid #e0e0e0;
            padding: 16px 24px 24px;
            position: relative;
            .master-title {
                color: @base-bg;
                font-size: 1.2em;
                padding-bottom: 8px;
                border-bottom: 1px solid #E0E6ED;
                margin-bottom: 24px;
            }
        }
    }
</style>
