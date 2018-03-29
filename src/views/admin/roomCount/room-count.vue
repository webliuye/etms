<template>
<master-page title="功能室使用统计">
    <div class="dashboard-container ">
      <div class="search-select">
        <el-button type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
         <div class="fr selectwidth1">
          <FuncRoomSelect @changeRoom="changeRoom"></FuncRoomSelect>
        </div>
        <div class="fr selectwidth">
          <TermSelect @changeTerm="changeTerm"></TermSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <div class="table-div roomCount">
        <el-table :data="listData" :span-method="spanMethod" border fit highlight-current-row style="width: 100%;color:#555;" ref="editTable">
          <el-table-column prop="learningName" label="学段" min-width="100" align="center"></el-table-column>
          <el-table-column prop="roomName" label="功能室类别" min-width="240" show-overflow-tooltip>
            <template slot-scope="scope">
              <router-link class=" el-button--text" :to="{name: 'roomDetail',params:{roomType:scope.row.roomType,learningType:scope.row.learningType,searchData:searchData}}">{{scope.row.roomName}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="classCount" label="教室间数" min-width="140" align="right"></el-table-column>
          <el-table-column prop="avgCount" label="校均教室间数" min-width="180" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.avgCount | numberAvgTimes}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="useCount" label="使用次数" min-width="140" align="right"></el-table-column>
          <el-table-column prop="useAvgCount" label="校均使用次数" min-width="180" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.useAvgCount | numberAvgTimes}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</master-page>
</template>

<script>
import { getAllRoomCount } from "api/index";
import FuncRoomSelect from "views/components/select/funcRoomSelect";
import YearSelect from "views/components/select/yearSelect";
import TermSelect from "views/components/select/termSelect";
import MasterPage from "views/layout/MasterPage";
import { mapGetters } from "vuex";
import { getRoomCount, getInfo } from "api/count";
import {numberTransTwo, changeDate, numberAvgTimes} from 'src/filters';
import {scrollTable} from "utils/index"
export default {
  name: "roomCount",
  components: { MasterPage, FuncRoomSelect, YearSelect, TermSelect },
  data() {
    return {
      listLoading: true,
      list: null,
      listData:[],
      checkList: [],
      searchData: {
        termYear: null,
        roomType: null,
        term: null
      },
      dialog: false,
      years: [],
      dataAll: {
        data: [],
        cityData: [],
        area: [],
        schoolArea: [],
        school: []
      },
      data: [],
      cityData: [],
      area: [],
      schoolArea: [],
      school: [],
      // chartData:[
      //   {
      //     value:0,
      //     name:'计算机教室'
      //   },
      //   {
      //     value:0,
      //     name:'音乐教室'
      //   }],
      // dataNum:[],
      orgType: this.$store.state.user.userInfo.orgType,
      orgId: this.$store.state.user.userInfo.orgId,
      title: "功能室使用情况"
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      // 获取表格数据
      var vm = this;
      getAllRoomCount(this.searchData).then(res => {
        this.list = res;
        this.listData = [];
        if(res && res.length > 0){
          this.list = res;
          res.forEach(function(s){
            if(s.schoolMultiRoomReportList && s.schoolMultiRoomReportList.length > 0){
              s.schoolMultiRoomReportList.forEach(function(u,v){
                if(v == 0){
                  u.learnLength = s.schoolMultiRoomReportList.length;
                }
                u.learningName = s.learningName;
                u.learningType = s.learningType;
                vm.listData.push(u);
              });
            }
          });
        }
      });
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if(row.learnLength && row.learnLength > 0){
          return {
            rowspan: row.learnLength,
            colspan: 1
          };
        }else{
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    showSchool() {
      this.dialog = true;
    },
    changeRoom(roomType) {
      this.searchData.roomType = roomType;
      this.findItem();
    },
    changeYear(year) {
      this.searchData.termYear = year;
      this.findItem();
    },
    changeTerm(term) {
      this.searchData.term = term;
      this.findItem();
    },
    findItem() {
      this.getList();
    },
    handleDownload() {
      var listData = [];
      if (this.list.length > 0) {
        this.list.forEach(function(item) {
          if (
            item.schoolMultiRoomReportList &&
            item.schoolMultiRoomReportList.length > 0
          ) {
            item.schoolMultiRoomReportList.forEach(function(items) {
              items.learningName = item.learningName;
              listData.push(items);
            });
          }
        });
      }
      require.ensure([], () => {
        const { export_json_to_excel } = require("vendor/Export2Excel");
        const tHeader = ["学段", "功能室类别", "教室间数", "校均教室间数", "使用次数", "校均使用次数"];
        const filterVal = [
          "learningName",
          "roomName",
          "classCount",
          "avgCount",
          "useCount",
          "useAvgCount"
        ];
        const list = JSON.parse(JSON.stringify(listData));
        list.forEach(function(s) {
          s.avgCount = numberAvgTimes(s.avgCount);
          s.useAvgCount = numberAvgTimes(s.useAvgCount);
        });
        var name = changeDate(new Date()) + "功能室使用统计";
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
  mounted(){
    scrollTable(".roomCount")
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
table {
  border-collapse: separate;
  border: none;
}

td {
  //  border:1px solid #ccc;
  //  text-align: center;
  padding: 0 18px;
  border: 1px solid #eee;
  border-collapse: collapse;
  border-right: none;
  border-top: none;
}
td:last-child {
  border-right: 1px solid #eee;
}
th {
  padding: 0 18px;
  border: 1px solid #eee;
  border-collapse: collapse;
  border-right: none;
}
th:last-child {
  border-right: 1px solid #eee;
}
tbody {
  border: none;
}
</style>
