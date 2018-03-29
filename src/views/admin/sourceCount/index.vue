<template>
  <master-page title="资源使用统计">
    <div class="dashboard-container">
      <div class="version-div">
        <div class="left-tree" style="max-height:640px;">
          <AreaTree @changeCode="changeCode"></AreaTree>
        </div>
      </div>
      <div class="right-content">
            <div class="search-select">
              <div class="fr selectwidth">
                <TermSelect @changeTerm="changeTerm"></TermSelect>
              </div>
              <div class="fr selectwidth">
                <YearSelect @changeYear="changeYear"></YearSelect>
              </div>
            </div>
            <div class="lineChart">
                <!-- <lineChart  className="course-info" :dataX="teacherName" :titleObj="barTitle" :dataNum="teacherData" id="course-info" :style="{width:'100%',height:'430px'}"></lineChart> -->
                <lineChart  :dataNum="chartData"  :style="{width:'100%',height:'300px'}"></lineChart>
            </div>
            <div class="table-div sourceCount">
              <el-table :data="list" fit highlight-current-row style="width: 100%" ref="list">
                <el-table-column  type="index" align="center" label="排名" width="80"></el-table-column>
                <el-table-column  prop="unitName" label="所属地区" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="sourceViewCount" align="right" label="资源查看数"   sortable min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="sourceCollectCount" align="right" label="资源收藏数"   sortable min-width="110" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="downloadCount" align="right" label="资源下载数"   sortable  min-width="90" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
      </div>
    </div>
  </master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
import YearSelect from "views/components/srcSelect/yearSelect";
import TermSelect from "views/components/select/termSelect";
import AreaTree from "views/components/areaTree";
import lineChart from "components/Charts/breakLine";
import { getGuideEquipCount } from "api/equipment";
import { getSourceTable, getSourceCart } from "api/source";
import { scrollTable } from 'utils/index'
export default {
  name: "sourceCount",
  components: { MasterPage, YearSelect, TermSelect, AreaTree, lineChart },
  data() {
    return {
      listLoading: true,
      pages: {
        total: 1,
        sizes: [10, 20, 30]
      },
      searchData: {
        year: null,
        term: null,
        unitId: ""
      },
      chartData: {},
      list: null,
      activeName: "first",
      data: [],
      orgType: this.$store.state.user.userInfo.orgType,
      orgId: this.$store.state.user.userInfo.orgId
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      if (this.searchData.year) {
        getSourceTable(this.searchData).then(res => {
          this.list = res;
        });
        getSourceCart(this.searchData).then(res => {
          res.datalist = [];
          res.monthList = [];
          res.data = [];
          res.forEach(function(e) {
            res.datalist.push(e.sourceTypeName);
            e.monthList = [];
            e.monthdata = [];
            //hash遍历
            for (var key in e.months) {
              e.monthList.push(key);
              e.monthdata.push(e.months[key]);
            }
            res.data.push(e);
          });
          res.monthList = res.data[0].monthList;
          res.seriesList = [];
          var i = 0;
          res.data.forEach(function(e) {
            i += 1;
            res.seriesList.push({
              name: e.sourceTypeName,
              type: "line",
              stack: i + "",
              data: e.monthdata
            });
          });
          this.chartData = {
            dataList: res.datalist,
            monthList: res.monthList,
            seriesList: res.seriesList
          };
        });
      } else {
        console.log("学年不能为空");
      }
    },
    changeCode(data) {
      this.searchData.unitId = data.unitId;
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
    changeYear(year) {
      this.searchData.year = year;
      console.log(year);
      this.getList();
    },
    changeTerm(term) {
      this.searchData.term = term;
      console.log(term);
      this.getList();
    },
    findItem() {
      this.getList();
    }
  },
  mounted() {
    this.getList();
    scrollTable('.sourceCount');
  }
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
</style>
