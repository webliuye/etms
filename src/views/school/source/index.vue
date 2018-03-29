<template>
  <master-page title="资源使用统计">
    <div class="dashboard-container">
      <div class="version-div">
        <div class="left-tree" style="max-height:640px;top:0px;">
          <SourceTree :catalogueId="searchData.catalogueId" @changeCode="changeCode"></SourceTree>
        </div>
      </div>
      <div class="right-content">
        <div class="search-select">
          <div class="fr">
            <el-input
              placeholder="资源名称或关键词"
              v-model="searchData.sourceName">
              <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="findItem">
              </i>
            </el-input>
          </div>
          <el-form  :model="formData" style="width:60%;">
            <el-form-item label="资源类别" class="checkRadio sourceRadio" :label-width="formLabelWidth">
              <el-radio-group v-model="searchData.resourceType" @change="getList">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button v-for="(item,index)  in sourceType" :key="index" :label="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <!-- <div class="search-select">
          <el-form  :model="formData" style="width:60%;">
            <el-form-item label="排序" class="checkRadio sourceRadio" :label-width="formLabelWidth">
              <el-radio-group v-model="searchData.sort" @change="getList">
                <el-radio-button label="sourceViewCount">热点</el-radio-button>
                <el-radio-button label="createTime">时间</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div> -->
        <div class="source-content">
          <el-row>
            <el-col :span="24" v-for="(item, index) in list" :key="index"   >
              <div style="position:relative;">
                <el-card :body-style="{ padding: '0px',clear:'both',height:'0'} " >
                    <div :class="item.resourceType" @click="toDetail(item)" class="srcTypeimage"></div>
                  <div class="panelBody"   >
                    <div class="fr"  v-if="item.resourceType=='RS_TYPE_VIDEO'" @click="toDetail(item)" >查看</div>
                    <div class="fr" v-else  @click="toDetail(item)" >下载</div>
                    <strong class="el-button--text sourceTitle" style="cursor:pointer;" @click="toDetail(item)" >{{item.name}}</strong>
                    <p>{{item.intro}}</p>
                    <div>
                      <span class="panelSpan">资源ID: {{item.serialNumber}}</span>
                      <span class="panelSpan"><img src="~assets/sourceImg/eye.png">  {{item.sourceViewCount}}次</span>
                      <span class="panelSpan"><img src="~assets/sourceImg/favorite.png"> {{item.sourceCollectCount}}次</span>
                      <span class="panelSpan"><img src="~assets/sourceImg/sizer.png"> {{item.resourceSize}}</span>
                      <span class="panelSpan"><img src="~assets/sourceImg/timer.png"> {{item.createTime}}</span>
                    </div>
                  </div>
                </el-card>
                <img src="~assets/sourceImg/vip.png" v-if="item.nature" class="vip">
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-show="!listLoading" class="pagination">
          <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
        </div>
      </div>
    </div>
  </master-page>
</template>

<script>
  import MasterPage from 'views/layout/MasterPage';
  import SourceTree from 'views/components/sourceTree';
  import { mapGetters } from 'vuex';
  import { getListData } from 'api/source';
  import Pagination from 'views/components/page/pagination';
  export default {
    name : 'sourceIndex',
    components : { MasterPage,  SourceTree, Pagination },
    data () {
      return {
        list:null,
        listLoading:false,
        pages:{
          total:1,
          sizes:[5,10,20,30]
        },
        searchData : {
          page:1,
          size:5,
          sourceName:'',
          resourceType:'',
          catalogueId:null,
          standardCode:null,
          testTableId:null,
          sort:'sourceViewCount'
        },
        formData: {
          testTableId:null,
          standardCode:null
        },
        orgType:this.$store.state.user.userInfo.orgType,
        orgId:this.$store.state.user.userInfo.orgId,
        formLabelWidth:'72px',
        treeData:[],
        navList:[]
      };
    },
    computed: {
      ...mapGetters([
        'sourceType'
      ])
    },
    created() {
      this.searchData.catalogueId = this.$route.query.catalogueId;
      this.searchData.standardCode = this.$route.query.catalogueId;
      if(this.$route.query.catalogueId){
        this.searchData.catalogueId = this.$route.query.catalogueId;
        this.searchData.testTableId = this.$route.query.catalogueId;
      }else if(this.$store.state.source.currentSource){
        this.searchData = jQuery.extend(this.searchData,this.formData,this.$store.state.source.currentSource);
      }
      this.$store.dispatch('GetSourceType');
      this.getList();
    },
    methods : {
      getList() {
        this.listLoading = true;
        getListData(this.searchData).then(res => {
          this.list = res.data;
          this.pages.total = res.total;
          if(this.pages.total>this.searchData.size){
            this.listLoading = false;
          }
        });
      },
      findItem(){
        this.getList();
      },
      changeCode(data, nodeData){
        if(nodeData.data){
          this.treeData = [];
          this.treeData.push(nodeData.data);
          this.navList=[];
          this.navList.push(nodeData.data);
          var t = nodeData.parent;
          while(t && t.level > 0){
            this.treeData.push(t.data);
            this.navList.push(t.data);
            t = t.parent;
          }
          var s;
          s = this.treeData.map(function(item){
            return item.textbookCode;
          });
          this.navList=this.navList.reverse();
          if(this.navData&&this.navData.length>1&&!nodeData.parent){
            this.navList=this.navData;
          };
          this.$store.commit('SET_LOCALTREEDATA',s);
        }else{
          var s;
          s = this.navList.map(function(item){
            return item.textbookCode;
          });
          s=s.reverse();
           this.$store.commit('SET_LOCALTREEDATA',s);
        }
        this.searchData = jQuery.extend(this.searchData,this.formData,data);
        this.getList();
      },
      // handleSizeChange(val) { // 显示多少页
      //   this.searchData.size = val;
      //   this.getList();
      // },
      // handleCurrentChange(val) {  // 点击页数
      //   this.searchData.page = val;
      //   this.getList();
      // },
      toDetail(item){
        this.$router.push({ name:'sourcePreview',params: {id:item.resourceId}});
      }
    },
    mounted () {

    }
  }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.table-in {
  border: none;
  box-sizing: border-box;
  width: 100%;
  td {
     border:1px solid #e0e0e0;
     text-align: center;
  }
}
.right-content{
  min-width:600px;
}
.version-div{
  background:#000;
}
.search-select {
  padding-bottom: 0;
}
.top-box{
  border:1px solid #e0e0e0;
  padding:16px 0px;
  margin-bottom:16px;
}
 .el-row{
   .el-card{
    //  margin-bottom:24px;
    padding:16px 16px;
     height:122px;
     border-radius: 0;
     box-shadow:none;
     border:1px solid transparent;
     border-bottom:1px solid #e0e0e0;
     cursor:pointer;
     &:hover{
       border-radius: 0;
       border: 1px solid #00a0e9;
     }

     .image {
        width: 60px;
        padding-top: 8px;
        height:auto;
        float:left;
        cursor: pointer;
      }

     .panelBody{
       font-size:12px;
        margin-left:60px;
        white-space:nowrap;
        padding:0 0 0 16px;
          .fr{
          padding:12px 24px;
          background:#00a0e9;
          color:#fff;
          margin-top:24px;
          cursor: pointer;
          &:hover{
              font-size:14px;
              font-weight: 900;
          }
        }
        p{
          overflow:hidden;
          text-overflow:ellipsis;
          width: 80%;
        }
        .panelSpan{
          padding-right:24px;
          img{
          display: inline-block;
          vertical-align:middle;
          }

        }
        .sourceTitle {
          display: inline-block;
          max-width: 440px;
          font-size: 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          color: #333;
          &:hover {
            color:#ff0000;
          }
        }
     }
  }

 }
  .vip{
  position:absolute;
  top:0;
  right:0;
}


.pagination{
margin-top:0px;
padding:5px 0px;
background: #fff;
// border:1px solid #d3dce6;
text-align: center;
}

</style>
