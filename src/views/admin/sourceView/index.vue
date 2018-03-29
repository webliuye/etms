<template>
  <master-page title="资源使用统计">
    <div class="dashboard-container">
      <div class="nav" >
        <span @click="subjectGetList" style="font-weight:900;" >{{subjectName}}</span>
        <span v-for="(item,index) in navList" :key="index" @click="saveNodeId(item,index)"><span style="color:#ccc;padding:0 5px;">>></span ><span class="baNav">{{item.data.name}}</span></span>
        <span ><span style="color:#999;padding:0 5px;">>></span >资源列表</span>
      </div>
      <div class="version-div">
        <div class="left-tree" style="max-height:640px;top:8px;">
          <SourceTree @changeCode="changeCode"></SourceTree>
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
              <el-form-item label="类别" class="checkRadio sourceRadio" :label-width="formLabelWidth">
                <el-radio-group v-model="searchData.resourceType" @change="changeType">
                  <el-radio-button label="">全部</el-radio-button>
                  <el-radio-button v-for="(item,index) in sourceType" :key="index" :label="item.value">{{item.label}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
           <!-- <div class="search-select">
            <el-form  :model="formData" style="width:60%;">
              <el-form-item label="排序" class="checkRadio sourceRadio" :label-width="formLabelWidth">
                <el-radio-group v-model="searchData.sort" @change="changeSort">
                  <el-radio-button label="sourceViewCount">热点</el-radio-button>
                  <el-radio-button label="createTime">时间</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div> -->
            <div class="source-content">
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
                    <img src="~assets/sourceImg/vip.png" v-if="item.nature==1" class="vip">
                  </div>
                </el-col>
              </el-row>
            </div>
            <div v-show="!listLoading" class="pagination">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
                :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
              </el-pagination>
            </div>

      </div>
    </div>
  </master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
import SourceTree from "views/components/sourceTree";
import { mapGetters } from "vuex";
import { getListData } from "api/source";
export default {
  name: "sourceView",
  components: { MasterPage, SourceTree },
  data() {
    return {
      list: null,
      listLoading: false,
      subjectName: "",
      navList: [],
      navitem: null,
      expandData: [],
      currentNode: "",
      pages: {
        total: 1,
        sizes: [5, 10, 20, 30]
      },
      searchData: {
        page: 1,
        size: 5,
        sourceName: "",
        resourceType: "",
        sort: "sourceViewCount"
      },
      formData: {
        editionId: null,
        learningPeriodId: null,
        subjectId: null,
        gradeId: null,
        volumeId: null,
        oneThemeId: null,
        twoThemeId: null,
        testTableId: null
      },
      orgType: this.$store.state.user.userInfo.orgType,
      orgId: this.$store.state.user.userInfo.orgId,
      formLabelWidth: "60px",
      treeData: []
    };
  },
  computed: {
    ...mapGetters(["sourceType"])
  },
  created() {
    this.$store.dispatch("GetSourceType");
    if (this.$store.state.commonData.adminResource.resourceType) {
      this.searchData.resourceType = this.$store.state.commonData.adminResource.resourceType;
    }
    if (this.$store.state.commonData.adminResource.sort) {
      this.searchData.sort = this.$store.state.commonData.adminResource.sort;
    }
    if (this.$store.state.source.currentSource) {
      this.searchData = jQuery.extend(
        this.searchData,
        this.formData,
        this.$store.state.source.currentSource
      );
    }
    this.getList();
  },
  methods: {
    saveNodeId(item, index) {
      this.navitem = item;
      this.currentNode = item.data.nodeId;
      this.navList = this.navList.slice(0, index + 1);
      this.expandData = [];
      this.navList.forEach(e => {
        this.expandData.push(e.data.nodeId);
      });
      this.searchData = jQuery.extend(
        this.searchData,
        this.formData,
        this.navList[index].data
      );
      this.getList(); //  this.expandData=index;
    },
    getList() {
      this.listLoading = true;
      getListData(this.searchData).then(res => {
        this.list = res.data;
        this.pages.total = res.total;
        if (this.pages.total > this.searchData.size) {
          this.listLoading = false;
        }
      });
    },
    changeSort() {
      this.$store.state.commonData.adminResource.sort = this.searchData.sort;
      this.getList();
    },
    changeType() {
      this.$store.state.commonData.adminResource.resourceType = this.searchData.resourceType;
      this.getList();
    },
    findItem() {
      this.getList();
    },
    changeCode(data, nodeData) {
      this.searchData = jQuery.extend(this.searchData, this.formData, data);
      this.getList();
    },
    subjectGetList() {
      this.navList = [];
      this.currentNode = null;
      this.searchData = {
        page: 1,
        size: 5,
        sourceName: "",
        resourceType: "",
        subjectId: this.subjectId,
        sort: "sourceViewCount"
      };
      this.getList();
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
    },
    toDetail(item) {
      if (this.$store.state.user.userInfo.orgType != "225") {
        this.$router.push({
          name: "sourcePreview",
          params: { id: item.resourceId }
        });
      } else {
        this.$router.push({
          name: "SourcePre",
          params: { id: item.resourceId }
        });
      }
    }
  },
  mounted() {}
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.table-in {
  border: none;
  box-sizing: border-box;
  width: 100%;
  td {
    border: 1px solid #ccc;
    text-align: center;
  }
}

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

.pagination {
  margin-top: 0px;
  padding: 5px 0px;
  background: #fff;
  // border:1px solid #d3dce6;
  text-align: center;
}

.search-select {
  padding-bottom: 0;
}
.vip {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
