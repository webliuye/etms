<template>
    <div class="master-page">
        <div class="clearfix">
        <levelbar></levelbar>
        </div>
        <div class="mainContainer" :style="{minHeight:contentHeight}">
<!--             <div class="master-title">
                {{title}}
            </div> -->
            <slot>
            </slot>
        </div>
    </div>
</template>
<script>
    import Levelbar from '../layout/Levelbar';
    export default {
      props: {
          title: {
              type: String,
              default: ''
          }
      },
      components: {
        Levelbar
      },
      data(){
          return{
              contentHeight:''
          }
      },
      created(){
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
        padding: 0 10px;
        min-height: 100%;

        .mainContainer {
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
