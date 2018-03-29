<template>
  <master-page title="目录预览">
    <form-value :formData="content" :isLocal="isLocal"></form-value>
    <p style="border-bottom:1px dashed #ececec;line-height:40px;"></p>
    <div class="link-source" v-if="list&&list.length>0">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span >相关资源</span>
                        <el-button type="text" class="fr" v-if="list.length>=6" @click="$router.push({ name:'srcIndex'})">更多</el-button>
                      </div>
                      <div v-for="(item,index)  in list" :key="index" class="itemBox" style="float:left;cursor:pointer" @click="toDetail(item)">
                        <div class="link_source_img" :class="item.sourceType"></div>
                        <p>{{item.sourceName}}</p>
                        <div class="breifCont">
                          <strong>资源简介：</strong>
                          <p> &nbsp;&nbsp;  {{item.sourceDescription}}...</p>
                          <el-button type="text" style="color:#fad67f;" @click="toDetail(item)">查看更多</el-button>
                        </div>
                      </div>
                    </el-card>
    </div>
  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import { getPlanPreview } from 'api/plan';
  import { getLinkSource } from 'api/source';
  import formValue from './../components/formValueone';
  export default {
    components: { MasterPage, formValue },
    data() {
      return {
        isLocal:false,
        content:{},
        list:[],
        catalogueId:''
      }
    },
    created() {
      this.getDetail ();

  	},
  	methods: {
  		getDetail () {
  			getPlanPreview(this.$route.params.planId).then(response => {
                this.content = response;
                this.catalogueId=response.catalogueId;
                this.getList();
                this.content.equipment = this.content.catalogueItemsList.map(function(item){
                  return item.name;
                }).filter(function(item){
                  return item;
                }).join("、");
  	        });
      },
      getList(){
          console.log(this.catalogueId);
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
    margin: 0 auto;
    max-width: 820px;
    width: 95%;
    font-size:12px;
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
