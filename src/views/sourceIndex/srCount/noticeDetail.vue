<template>  
  <master-page title="公告详情">
    <div class="filter-container">
      <el-button class="pull-right main-returnA" type="text" @click="$router.go(-1)">返回</el-button> 
    </div>
    <el-row :gutter="48" class="con-box">
      <el-col :span="24">
        <div style="border-bottom:1px solid #999;text-align:center;">
          <h3 class="text-center" v-text='title'></h3>
          <p>
            发布时间：<span v-text='createTime'></span> 文章来历：<span v-text='unitName'></span>
          </p>
        </div>
        <div class="content" v-html="content"></div>
      </el-col>
      <!-- <el-col :span="6" >    
        <div class="content " >
          <div class="r-content" v-for="(item,index)  in list" :key="index">
            <router-link :to="{name: 'NoticeDetail',params:{id:item.id}}"><h6>{{item.title}}</h6></router-link>
          </div>
        </div>
      </el-col> -->
  </el-row>  

  </master-page>
</template>

<script>
  import MasterPage from 'views/layout/MasterPage1'; 
  import {getNoticeDetail} from 'api/source';
  export default {
    components: {
      MasterPage
    },
    data() {
      return {
        title: null,
        content: null,
        unitName:null,
        createTime:null,
     }    
     
    },
    created() {         
      this.id = this.$route.params.id;
      this.getList();    
    },
    methods: {
      getList() { // 获数据      
        getNoticeDetail(this.id).then(res => {
         this.unitName=res.unitName;
         this.createTime=res.createTime;
         this.title=res.title;
         this.content=res.content;      
        }).catch(err => {
            console.log(err);
        });
      },
    }
  }
</script>
<style lang="less" scoped>
.cont-box{
  margin-left: 0;
  margin-right: 0;
}
  .content{ margin-top: 32px; font-size: 12px; }
  h3{
    font-size: 18px;
    margin:16px 0 ;
  }
  h6{
    margin:0;
  }
  *{
    color:#333;
  }
  p{
    font-size:12px;
    span{
      padding-right:16px;
    }
  }
  .el-button{
    width:100%;
    text-align: right;
  }
  .r-content{
    border-bottom:1px dashed #ccc;
    margin-top:16px;
    padding-bottom:16px;
    transition: all 0.3s linear;

    &:hover{
        padding-left:16px;
        transition: all 0.3s linear;

        h6 {
          color: #34a5f4;
        }

    } 
  }
</style>

