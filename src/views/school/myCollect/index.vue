<template>
  <master-page title="资源使用统计">
    <div class="dashboard-container">
      <div class="search-select">
          <el-form  :model="searchData" style="width:60%;">
            <el-form-item label="资源类别" class="checkRadio sourceRadio" :label-width="formLabelWidth">
              <el-radio-group v-model="searchData.sourceType" @change="getList">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button v-for="(item,index)  in sourceType" :key="index" :label="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
           </div>
            <div class="source-content">
              <el-row>
                <el-col :span="24" v-for="(item, index) in list" :key="index" >
                  <div style="position:relative;">
                    <el-card :body-style="{ padding: '0px',clear:'both',height:'0'}">
                        <img v-if="item.status" src="~assets/sourceImg/loseLive.png" style="position:absolute;top:0;left:0;">
                        <div :class="item.sourceType" @click="toDetail(item)" class="srcTypeimage"></div>
                      <div class="panelBody" >
                        <strong class="el-button--text  sourceTitle" style="cursor:pointer;"  @click="toDetail(item)">{{item.sourceName}}</strong>
                        <p><span>{{item.sourceDescription}}</span><a href='javascript:;' v-if="!item.status" class ="el-button--text fr" @click="collectMeFalse(item)">取消收藏</a></p>
                        <div>
                          <span class="panelSpan">资源ID: {{item.serialNumber}}</span>
                          <span class="panelSpan"><img src="~assets/sourceImg/eye.png">  {{item.sourceViewCount}}次</span>
                          <span class="panelSpan"><img src="~assets/sourceImg/favorite.png"> {{item.sourceCollectCount}}次</span>
                          <span class="panelSpan"  v-if="item.sourceType!='RS_TYPE_VIDEO'" ><img src="~assets/sourceImg/dlGray.png">{{item.downloadCount}}次</span>
                          <span class="panelSpan" v-if="item.sourceSize"><img src="~assets/sourceImg/sizer.png"> {{item.sourceSize}} </span>
                          <span class="panelSpan"><img src="~assets/sourceImg/timer.png"> {{item.createTime}}</span>
                          </div>
                      </div>
                      <div v-if="item.status" class="status">
                        <br>
                        <br>【{{item.sourceName}}】已被资源方删除或下架
                        <a href='javascript:;' class ="el-button--text fr quilt"  @click="collectMeFalse(item)">取消收藏</a>
                      </div>
                    </el-card>
                     <img src="~assets/sourceImg/vip.png" v-if="item.isFree=='false'" class="vip">
                  </div>
                </el-col>
              </el-row>
            </div>
            <div v-show="!listLoading" class="pagination">
              <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
              <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
                :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
              </el-pagination> -->
            </div>
        </div>
  </master-page>
</template>

<script>
  import MasterPage from 'views/layout/MasterPage';
  import AreaTree from 'views/components/areaTree';
  import { mapGetters } from 'vuex';
  import { getCollectList, cancelCollect, downloadSource } from 'api/source';
  import Pagination from 'views/components/page/pagination';
  export default {
    name : 'sourceView',
    components : { MasterPage,  AreaTree, Pagination},
    data () {
      return {
        list:null,
        listLoading:false,
        radio:'',
        data:[],
        pages:{
          total:1,
          sizes:[5,10,20,30]
        },
        searchData : {
          sourceType : '',
          page:1,
          size:5
        },
        orgType:this.$store.state.user.userInfo.orgType,
        orgId:this.$store.state.user.userInfo.orgId,
        formLabelWidth:'60px'
      };
    },
    computed: {
      ...mapGetters([
        'sourceType'
      ])
    },
    created() {
      this.$store.dispatch('GetSourceType');
      this.getList();
    },
    methods : {
      getList() {
        this.listLoading = true;
        getCollectList(this.searchData).then(res => {
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
      changeCode(data){
        console.log(data);
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
      },
      downSource(item) {
        var link = document.createElement('a');
        link.href = item.url;
        document.body.appendChild(link);
        console.log(link.href);
        link.download = 'abc';
        link.click();
        // downloadSource(item.sourceId).then(res => {
        //   console.log(res);
        // });
      },
      collectMeFalse(item) {
        this.$confirm(`你确定要对资源【${item.sourceName}】取消收藏吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancelCollect(item.resourceId).then(() => {
            this.getList();
          });
        });
      },
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
     border:1px solid #ccc;
     text-align: center;
  }
}
.search-select {
  padding-bottom: 0;
}
.el-card.checkRadio{
 font-weight:normal;
  font-size:12px;
  min-height:48px;
  // margin-bottom:24px;
  padding:8px 16px;
   border:1px solid transparent;
   border-radius:0;
   box-shadow:none;
   border-bottom:1px solid #eee;

}
 .el-row{
   .el-card{
    //  margin-bottom:24px;
     padding:16px 16px;
     height:122px;
     border-radius: 0;
     box-shadow:none;
     border:1px solid transparent;
     border-bottom:1px solid #eee;
     position: relative;
     &:hover{
       border-radius: 0;
       border: 1px solid #00a0e9;
     }
     .status{
       position:absolute;
      //  padding:16px 16px;
       top:0;
       left:0;
       width:100%;
       height:100%;
       z-index:1000;
       text-align:center;
       font-size:18px;
       font-weight:bold;
       color:transparent;
       &:hover{
         color:#ea9518;
         background:rgba(0,0,0,0.5);
       }
       .quilt{
        font-size:normal;
        margin-right:48px;
        font-size:12px;
        font-weight:100;
       }
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
        margin-left:100px;
        white-space:nowrap;
        padding:0 24px;
        p{
          span {
            display: inline-block;
            width: 80%;
            overflow:hidden;
            text-overflow:ellipsis;
          }
        }
        .panelSpan{
          padding-right:24px;
          img {
            display: inline-block;
            vertical-align: middle;
          }
        }
     }
  }

 }

.pagination{
margin-top:0px;
padding:5px 0px;
background: #fff;
// border:1px solid #d3dce6;
text-align: center;
}
.vip{
    position:absolute;
    top:0;
    right:0;
  }
.collect {
  float: right;
  display: inline;
  cursor: pointer;
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
</style>
