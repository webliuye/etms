<template>
  <div>
     <p style="border-bottom:1px dashed #ececec;line-height:40px;"></p>
        <div class="link-source">
          <h4  style="color:#666;">相关资源:</h4>
          <div v-for="(item,index)  in list" :key="item" class="itemBox" style="float:left;cursor:pointer" @click="toDetail(item)">
            <div class="link_source_img" :class="item.sourceType"></div>
            <p>{{item.sourceName}}</p>
            <div class="breifCont">
              <strong>资源简介：</strong>
              <p> &nbsp;&nbsp;  {{item.sourceDescription}}...</p>
              <el-button type="text" style="color:#fad67f;" @click="toDetail(item)">查看更多</el-button>
            </div>
          </div>
          <div v-if="list.length<1">暂无相关资源</div>
        </div>
  </div>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import { getLinkSource } from 'api/source';
  export default {
    components: { MasterPage },
    props: {
      catalogueId: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        list:[]
      }
    },
    created() {
      this.getList();
    },
    methods:{
       getList(){
         getLinkSource({catalogueId:this.catalogueId}).then(res=>{
           console.log(res);
           this.list=res;
         })
      },
      toDetail(item){
         this.$router.push({ name:'sourcePreview',params: {id:item.resourceId}});
      }
    }
  }
</script>
<style lang="less" scoped>
  .link-source{
    // margin: 0 auto;
    padding-left:24px;
    max-width: 820px;
    width: 95%;
    font-size:12px;
    height:240px;
    .itemBox{
       width:100px;
       min-height:106px;
       padding:8px;
       position:relative;
       margin:0 8px;
       margin-bottom:16px;
      .breifCont{
        position:absolute;
        top:0;
        left:0;
        width:120%;
        height:100% ;
        background:rgba(0,0,0,0.5);
        font-size:12px;
        color:#fff;
        padding:8px;
        overflow:hidden;
        opacity:0;
        transition:opacity 0.3s linear;
        p{
          padding:0;
          margin:0;
          height:96px;
          overflow:hidden;
        }
      }
      &:hover .breifCont{
        opacity:1;
        transition:opacity 0.3s linear;
      }
    }


  }
</style>
