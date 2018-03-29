<template>
 <master-page title="资源搜索">
    <div class="filter-container">
      <el-button class="pull-right main-return" type="text" @click="$router.go(-1)">返回</el-button>
    </div>
    <div class="source-content" style="border-top:none;">
      <el-row>
        <el-col :span="24" v-for="(item, index) in list" :key="index" >
          <div style="position:relative;">
            <el-card :body-style="{ padding: '0px',clear:'both',height:'0'}">
                   <div :class="item.resourceType" @click="toDetail(item)" class="srcTypeimage"></div>
              <div class="panelBody" >
                <div class="fr"  v-if="item.resourceType=='RS_TYPE_VIDEO'" @click="toDetail(item)" >查看</div>
                <div class="fr" v-else  @click="toDetail(item)" >下载</div>
                <strong class="el-button--text sourceTitle" style="cursor:pointer;" :title="item.name"  @click="toDetail(item)">{{item.name}}</strong>
                <p :title="item.intro">{{item.intro}}</p>
                <div>
                  <span class="panelSpan">资源ID: {{item.serialNumber}}</span>
                  <span class="panelSpan"><img src="~assets/sourceImg/eye.png">  {{item.sourceViewCount}}次</span>
                  <span class="panelSpan"><img src="~assets/sourceImg/favorite.png"> {{item.sourceCollectCount}}次</span>
                  <span class="panelSpan"  v-if="item.resourceType!='RS_TYPE_VIDEO'" ><img src="~assets/sourceImg/dlGray.png"> {{item.downloadNum}}次</span>
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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
        :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
      </el-pagination>
    </div>
    <div v-if="listDataBln">
      <p class="noData">暂无数据</p>
    </div>


  </master-page>

</template>

<script>
import MasterPage from "views/layout/MasterPage1";
import { getListData } from "api/sourceIndex";
export default {
  name: "searchSource",
  components: {
    MasterPage
  },
  data() {
    return {
      list: null,
      listLoading: false,
      pages: {
        total: 1,
        sizes: [5, 10, 20, 30]
      },
      searchData: {
        page: 1,
        size: 5,
        sourceName: ""
      },
      listDataBln: false
    };
  },
  created() {
    this.searchData.sourceName = this.$route.params.sourceName;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listDataBln = false;
      getListData(this.searchData).then(res => {
        if (!res.data || res.data.length < 1) {
          this.listDataBln = true;
        }
        this.list = res.data;
        this.pages.total = res.total;
        if (this.pages.total > this.searchData.size) {
          this.listLoading = false;
        }
      });
    },
    findItem() {
      this.getList();
    },
    cancel() {
      this.$router.go(-1);
    },
    toDetail(item) {
      if(this.$store.getters.token){
         this.$router.push({ name: "SourcePre", params: { id: item.resourceId } });
      }else{
        this.$store.state.commonData.loginshow=true;
      }
    },
    handleSizeChange(val) {
      // 显示多少页
      this.searchData.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      // 点击页数
      this.searchData.page = val;
      this.getList();
    }
  }
};
</script>

<style  rel="stylesheet/less" lang="less" scoped>
.el-card.checkRadio {
  font-weight: normal;
  font-size: 12px;
  min-height: 48px;
  // margin-bottom:24px;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 0;
  box-shadow: none;
  border-bottom: 1px solid #eee;
}
.el-row {
  .el-card {
    //  margin-bottom:24px;
    padding: 16px 16px;
    height: 122px;
    border-radius: 0;
    box-shadow: none;
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    position: relative;
    &:hover {
      border-radius: 0;
      border: 1px solid #00a0e9;
    }

    .image {
      width: 60px;
      padding-top: 8px;
      height: auto;
      float: left;
      cursor: pointer;
    }

    .panelBody {
      font-size: 12px;
      margin-left: 60px;
      white-space: nowrap;
      padding: 0 0 0 16px;
      .fr {
        padding: 12px 24px;
        background: #00a0e9;
        color: #fff;
        margin-top: 24px;
        cursor: pointer;
        &:hover {
          font-size: 14px;
          font-weight: 900;
        }
      }
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 80%;
      }
      .panelSpan {
        padding-right: 24px;
        img {
          display: inline-block;
          vertical-align: middle;
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
          color: #ff0000;
        }
      }
    }
  }
}
.vip {
  position: absolute;
  top: 0;
  right: 0;
}

.pagination {
  margin-top: 0px;
  padding: 5px 0px;
  background: #fff;
  // border:1px solid #d3dce6;
  text-align: center;
}
</style>
