<template >  
  <el-row :gutter="48" class="con-box">
      <el-col :span="18">
        <div style="border-bottom:1px solid #999;text-align:center;">
          <h3 class="text-center" v-text='title'></h3>
          <p>
            发布时间：<span v-text='createTime'></span> 文章来历：<span v-text='unitName'></span>
          </p>
        </div>
        <div class="content" v-html="content"></div>
      </el-col>
      <el-col :span="6" >
        <div  v-if="isAdmin&&(orgType!='225')" style="line-height:84px;border-bottom:1px solid #999;" >
          <router-link :to="{ path: '/notice/releace'}" class="el-button filter-item ">
            <span style="color:#20a0ff;">添加公告</span>
          </router-link>
        </div>
        <div class="content " v-if="isAdmin" >
          <div class="r-content" v-for="(item,index)  in list" :key="index">
            <router-link :to="{name: 'NoticeDetail',params:{id:item.id,isAdmin:true}}"><h6>{{item.title}}</h6></router-link>
         
          </div>
        </div>
        <div class="content " v-if="!isAdmin" >
          <div class="r-content" v-for="(item,index)  in list" :key="index">
            <router-link :to="{name: 'SchoolNoticeDetail',params:{id:item.id,isAdmin:false}}"><h6>{{item.title}}</h6></router-link>
          
          </div>
        </div>
      
      </el-col>
  </el-row>    
</template>

<script>
  import { getNoticeDetail ,getNoticeList ,staffNoticeChange} from 'api/notice';
  export default {
    data() {
      return {
        title: null,
        content: null,
        unitName:null,
        createTime:null,
        isAdmin:false,
        list:[],
        listQuery: {
          page: 1,
          size: 10
        },
          orgType:this.$store.state.user.userInfo.orgType
      }    
     
    },
    created() {         
      this.id = this.$route.params.id;
      this.$store.state.user.userInfo.orgType==='225'?this.isAdmin=false:this.isAdmin=true;
      // this.isAdmin= this.$route.params.isAdmin;
      this.getInfo();
      this.getList();
    },
    methods: {
      getInfo(){
        getNoticeDetail(this.id).then(response => {
          const data = response;
          this.title = data.title;
          staffNoticeChange(data.id).then(response=>{
             console.log("阅读状态更新成功");
          });
          this.createTime = data.createTime;
          this.unitName = data.unitName;
          this.content = data.content;
        });       
      },
      getList() { // 获取表格数据
      
        getNoticeList(this.listQuery).then(response => {
      
          this.list = response.data.slice(0,3);
         
          
        }).catch(err => {
            
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

