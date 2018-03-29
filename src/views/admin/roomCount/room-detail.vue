<template>
<master-page >
  <div class="dashboard-container " >
    <el-button class="pull-right main-return" type="text" @click="$router.go(-1);">返回</el-button>
    <div class="version-div">
      <div v-if="orgType!='223'" class="left-tree roomCount" style="max-height:640px;">
        <AreaTree @changeCode="changeCode"></AreaTree>
      </div>
      <div :class="{right_content:orgType!='223'}">
        <div class="table-div roomDetail">
          <el-table :data="list" fit highlight-current-row style="width: 100%;color:#555;" ref="editTable">
            <el-table-column prop="unitName" label="单位名称" min-width="240" show-overflow-tooltip></el-table-column>
            <el-table-column prop="classCount" align="right" label="教室间数" min-width="120"></el-table-column>
            <el-table-column prop="avgCount" align="right" label="校均教室间数" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.avgCount | numberAvgTimes}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="useCount" align="right" label="使用次数" min-width="120"></el-table-column>
            <el-table-column prop="useAvgCount" align="right" label="校均使用次数" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.useAvgCount | numberAvgTimes}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</master-page>
</template>

<script>
import { getRoomCountDetail } from "api/index";
import MasterPage from "views/layout/MasterPage";
import { mapGetters } from "vuex";
import AreaTree from "views/components/areaTree";
import { numberTransTwo, numberAvgTimes } from "../../../filters";
import {scrollTable} from "utils/index"
export default {
  name: "roomCount",
  components: { MasterPage, AreaTree },
  data() {
    return {
      listLoading: true,
      list: [],
      searchData: {
        termYear: null,
        roomType: null,
        term: null,
        learningType: [],
        unitId: null,
        unitType: null
      },
      orgType: this.$store.state.user.userInfo.orgType,
      orgId: this.$store.state.user.userInfo.orgId,
      title: "功能室使用情况"
    };
  },
  created() {
    this.searchData.roomType = this.$route.params.roomType;
    this.searchData.learningType = this.$route.params.learningType;
    if (this.$route.params.searchData) {
      this.searchData.term = this.$route.params.searchData.term;
      this.searchData.termYear = this.$route.params.searchData.termYear;
    }
    this.searchData.unitId = this.$store.state.user.userInfo.orgId;
    this.searchData.unitType = this.$store.state.user.userInfo.orgType;
    this.getList();
  },
  methods: {
    getList() {
      // 获取表格数据
      getRoomCountDetail(this.searchData).then(res => {
        if(res && res.length > 0){
          this.list = res;
        }else{
          this.list = [];
        }
      });
    },
    changeCode(data) {
      this.searchData.unitId = data.unitId;
      this.searchData.unitType = data.unitType;
      this.getList();
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("vendor/Export2Excel");
        const tHeader = ["单位名称", "教室间数", "校均教室间数", "使用次数", "校均使用次数"];
        const filterVal = [
          "unitName",
          "classCount",
          "avgCount",
          "useCount",
          "useAvgCount"
        ];
        const list = JSON.parse(JSON.stringify(this.list));
        list.forEach(function(s) {
          s.avgCount = numberAvgTimes(s.avgCount);
          s.useAvgCount = numberAvgTimes(s.useAvgCount);
        });
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "功能室使用详情");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
  ,mounted(){
    scrollTable(".roomDetail")
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container {
  font-family: "微软雅黑";
}
.home-p {
  width: 100%;
  border-bottom: 1px solid #eee;
  line-height: 1.6em;
  font-size: 12px;
}
.right {
  float: right;
  display: inline;
}
.expand {
  padding: 0 0 0 50px;
}

td {
  //  border:1px solid #ccc;
  //  text-align: center;
  padding: 0 8px;
}

th {
  padding: 0 8px;
}
</style>
