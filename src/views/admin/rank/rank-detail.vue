<template>
<master-page title="实验开出排行详情">
    <div class="dashboard-container rankDetail">
      <el-button class="pull-right main-return" type="text" @click="$router.go(-1);">返回</el-button>
      <div class="search-select">
        <el-button class="fl" type="primary" icon="el-icon-document" @click="handleDownload">导出</el-button>
        <div class="fr">
          <el-button icon="el-icon-search" @click="findItem"></el-button>
        </div>
        <div class="fr selectwidth">
          <SchoolSelect :dataAll="dataAll" :searchData="searchData" v-model="searchData.schoolUnitsArray"></SchoolSelect>
        </div>
        <div class="fr selectwidth">
          <CountySelect :dataAll="dataAll" :searchData="searchData" v-model="searchData.county"></CountySelect>
        </div>
        <div class="fr selectwidth">
          <CitySelect :dataAll="dataAll" :searchData="searchData" v-model="searchData.city"></CitySelect>
        </div>
        <div class="fr selectwidth">
          <TermSelect @changeTerm="changeTerm"></TermSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <el-table :data="list"  border fit highlight-current-row style="width: 100%" ref="editTable" class="table-all">
        <el-table-column  prop="subjectLabel" align="center" label="科目"></el-table-column>
        <el-table-column  prop="gradeLabel" align="center" label="年级"></el-table-column>
        <el-table-column  prop="termLabel" align="center" label="学期"></el-table-column>
        <el-table-column  align="center" label="分组实验">
          <el-table-column  prop="stdCnt1" align="center" label="应开数"></el-table-column>
          <el-table-column  prop="amount1" align="center" label="实开数"></el-table-column>
          <el-table-column  prop="p1" align="center" label="开出率" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.p1 | numberTrans}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column  align="center" label="演示实验">
          <el-table-column  prop="stdCnt2" align="center" label="应开数"></el-table-column>
          <el-table-column  prop="amount2" align="center" label="实开数"></el-table-column>
          <el-table-column  prop="p2" align="center" label="开出率" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.p2 | numberTrans}}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    </master-page>
</template>

<script>
import CitySelect from "views/components/select/citySelect";
import CountySelect from "views/components/select/countySelect";
import SchoolSelect from "views/components/select/schoolSelect";
import YearSelect from "views/components/select/yearSelect";
import TermSelect from "views/components/select/termSelect";
import { mapGetters } from "vuex";
import { getRankDetail, getInfo } from "api/count";
import MasterPage from "views/layout/MasterPage";
import PieChart from "components/Charts/pieChart";
import BarChart from "components/Charts/barChart";
import { numberTransTwo, changeDate } from "../../../filters";
  import {scrollTable} from 'utils/index'
export default {
  name: "openRecord",
  components: {
    CitySelect,
    CountySelect,
    SchoolSelect,
    YearSelect,
    TermSelect,
    MasterPage,
    PieChart,
    BarChart
  },
  data() {
    return {
      listLoading: true,
      list: null,
      checkList: [],
      searchData: {
        city: "",
        county: "",
        schoolUnitsArray: [],
        schoolUnits: "",
        orgType: "",
        orgId: "",
        name: "",
        year: ""
      },
      dataAll: {
        data: [],
        cityData: [],
        area: [],
        schoolArea: [],
        school: [],
        dataVal: [],
        dataSVal: []
      },
      orgType: "",
      orgId: ""
    };
  },
  created() {
    this.orgType = this.$route.params.type;
    this.orgId = this.$route.params.id;
    this.searchData.orgType = this.orgType;
    this.searchData.orgId = this.orgId;
    this.getList();
  },
  methods: {
    getList() {
      // 获取表格数据
      getRankDetail(this.searchData).then(res => {
        this.list = res;
      });
    },
    getInfo() {
      getInfo().then(res => {
        var that = this;
        this.dataAll.data = res;
        this.dataAll.dataVal = this.dataAll.data.filter(function(item) {
          return (
            item.type == Number(that.orgType) + 1 && item.parentId == that.orgId
          );
        });
        this.dataAll.dataSVal = this.dataAll.data.filter(function(item) {
          return item.type == "4" && item.parentId == that.orgId;
        });

        if (this.orgType == "222") {
          this.dataAll.area = this.dataAll.dataVal;
        } else if (this.orgType == "223") {
          this.dataAll.school = this.dataAll.dataVal;
        }
        this.dataAll.schoolArea = this.dataAll.dataSVal;
      });
    },
    changeYear(year) {
      this.searchData.year = year;
    },
    changeTerm(term) {
      this.searchData.term = term;
    },
    findItem() {
      this.searchData.schoolUnits = this.searchData.schoolUnitsArray.join(",");
      if (this.searchData.schoolUnits != "") {
        this.searchData.orgType = "4";
        this.searchData.orgId = this.searchData.schoolUnits;
      } else {
        this.searchData.orgType = "224";
        this.searchData.orgId = this.searchData.county;
      }
      if (!this.searchData.orgId) {
        this.searchData.orgType = this.$route.params.type;
        this.searchData.orgId = this.$route.params.id;
      }
      this.getList();
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("vendor/Export2Excel");
        const tHeader = [
          "科目",
          "年级",
          "学期",
          "应开数",
          "实开数",
          "开出率",
          "应开数",
          "实开数",
          "开出率"
        ];
        const filterVal = [
          "subjectLabel",
          "gradeLabel",
          "termLabel",
          "stdCnt1",
          "amount1",
          "p1",
          "stdCnt2",
          "amount2",
          "p2"
        ];
        const list = JSON.parse(JSON.stringify(this.list));
        list.forEach(function(s) {
          s.p1 = numberTransTwo(s.p1);
          s.p2 = numberTransTwo(s.p2);
        });
        var name = changeDate(new Date()) + "实验开出排行详情";
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, name);
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
  },
  mounted() {
    this.getInfo();
    scrollTable('.rankDetail');
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
  font-size: 14px;
}
.right {
  float: right;
  display: inline;
}
.table-all {
  margin-top: 20px;
}
.expert-info {
  margin: 0 auto;
}
.course-info {
  margin: 0 auto;
}
</style>
