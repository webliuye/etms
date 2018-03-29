<template>
		<div class="filter-container">
			<div class="search-select">
        <el-button type="primary"  icon="el-icon-download" href='javascript:;' @click="handleDownload2">导出</el-button>
        <div class="fr">
          <el-input placeholder="教师名称" v-model="searchData.staffName">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="findItem1">
            </i>
          </el-input>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <div class="table-div" id="secondTable">
        <el-table  :data="list" border fit highlight-current-row style="width: 100%" ref="editTable2">
          <el-table-column type="index" align="center" label="排行" width="74"></el-table-column>
          <el-table-column prop="name" align="left" label="教师名称" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="unitName" align="left" label="所在学校" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="分组实验">
            <el-table-column prop="mustGroupEt" align="right" label="应开数" min-width="80"></el-table-column>
            <el-table-column prop="factGroupEt" align="right" label="实开数" min-width="80"></el-table-column>
            <el-table-column prop="groupRate" align="right" label="开出率" min-width="100" sortable>
              <template slot-scope="scope">
                <span>{{scope.row.groupRate | numberTrans}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="演示实验">
            <el-table-column prop="mustDemoEt" align="right" label="应开数" min-width="80"></el-table-column>
            <el-table-column prop="factDemoEt" align="right" label="实开数" min-width="80"></el-table-column>
            <el-table-column prop="demoRate" align="right" label="开出率" min-width="100" sortable>
              <template slot-scope="scope">
                <span>{{scope.row.demoRate | numberTrans}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="rate" align="right" label="总开出率" min-width="120" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.rate | numberTrans}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
        </div>
      </div>
      <div style="height:1000px;width:1000px;"></div>
      <form id="myForm" v-show="false" ref="downloadForm"  method="get">
        <input type="text" name="token" v-model="download.token">
        <input type="text" name="url" v-model="download.url">
        <input type="submit" id="submitBtn">
     </form>
		</div>
</template>

<script>
import Pagination from "views/components/page/pagination";
import YearSelect from "views/components/select/yearSelect";
import TermSelect from "views/components/select/termSelect";
import GradeSelect from "views/components/select/gradeSelect";
import SubjectSelect from "views/components/select/subjectSelect";
import {numberTransTwo, changeDate, numberTransValue} from 'src/filters';
import { scrollTable } from 'src/utils';
import { mapGetters } from "vuex";
import {
  getCondit,
  getSchoolCondit,
  getDownload,
  getDownload2
} from "api/count";
export default {
  name: "rankCount",
  components: { 
    YearSelect, 
    GradeSelect,
    TermSelect,
    SubjectSelect,
    Pagination 
  },
  data() {
    return {
      listLoading: true,
      schoolList: null,
      list: null,
      checkList: [],
      pages: {
        total: 1,
        sizes: [10, 20, 30, 50]
      },
      searchData: {
        subject: null,
        staffName: null,
        unitName: null,
        gradeId: null,
        schoolName: "",
        termYear: "",
        page: 1,
        size: 50
      },
      activeName2: "second",
      chartData: [],
      dataNum: [],
      orgType: "",
      orgId: "",
      changeSchool: true,
      download: {
        token: this.$store.getters.token,
        url:
          this.$store.getters.objApi.BASE_API + "/api/report/open-schoolExcel"
      }
    };
  },
  computed: {
    ...mapGetters(["nowYear"])
  },
  created() {
    this.searchData.termYear = this.nowYear;
    this.getList();
  },
  methods: {
    getList() {
      // 获取表格数据
      // this.searchData.page=1;
      getCondit(this.searchData)
        .then(res => {
          this.list = res.data;
          this.pages.total = res.total;
          var that = this;
          if (res.total > this.searchData.size) {
            this.listLoading = false;
          }
        })
        .catch(err => {
          this.listLoading = false;
        });
    },
    tableRowClassName(row, index) {
      return "info-row";
    },
    changeYear(year) {
      this.searchData.termYear = year;
      this.getList();
    },
    findItem1() {
      this.searchData.page = 1;
      this.getList();
    },
    handleDownload() {
      getCondit().then(res => {
        require.ensure([], () => {
          const { export_json_to_excel } = require("vendor/Export2Excel");
          const tHeader = ["学校名称", "开课次数", "班级数", "班级平均开课数", "最近上课时间"];
          const filterVal = [
            "unitName",
            "amount",
            "classAmount",
            "rate",
            "classDate"
          ];
          const list = res;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "教师开出统计");
        });
      });
    },
    handleDownload2() {
      getCondit().then(res => {
        require.ensure([], () => {
          const { export_json_to_excel } = require("vendor/Export2Excel");
          const tHeader = [
            "排行",
            "教师名称",
            "所在学校",
            "分组应开数",
            "分组实开数",
            "分组开出率(%)",
            "演示应开数",
            "演示实开数",
            "演示开出率(%)",
            "总开出率(%)"
          ];
          const filterVal = [
            "rank",
            "name",
            "unitName",
            "mustGroupEt",
            "factGroupEt",
            "groupRate",
            "mustDemoEt",
            "factDemoEt",
            "demoRate",
            "rate"
          ];
          const list = res;
          list.forEach(function(s, index) {
            s.rank = index + 1;
            s.groupRate = numberTransValue(s.groupRate);
            s.demoRate = numberTransValue(s.demoRate);
            s.rate = numberTransValue(s.rate);
          });
          var name = changeDate(new Date()) + "教师开出统计";
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, name);
        });
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
    },
    _handleDownload() {
      this.download.url =
        this.$store.getters.objApi.BASE_API + "/api/report/open-schoolExcel";
      let urlData = "";
      for (let i in this.searchData) {
        urlData += i + "=" + this.searchData[i] + "&";
      }
      urlData = urlData.length
        ? urlData.substr(0, urlData.length - 1)
        : urlData;
      this.download.url = this.download.url + "?" + urlData;
      this.$refs.downloadForm.action =
        this.$store.getters.objApi.BASE_API + "/api/proxy/download";
      this.$refs.downloadForm.submit();
      //getDownload2(this.download);
    }
  },
  mounted() {
    scrollTable(null, "#secondTable .el-table__header-wrapper");
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
// td.time-color {
//   background-color: red;
// }
</style>
