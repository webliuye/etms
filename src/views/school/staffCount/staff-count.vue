
<template>
<master-page title="教师开出情况">
    <div class="dashboard-container staffCount">
      <div class="search-select">
        <div class="fr">
          <el-button icon="el-icon-search" @click="findItem"></el-button>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
        <div class="fr selectwidth">
          <TermSelect @changeTerm="changeTerm"></TermSelect>
        </div>
        <div class="fr selectwidth">
          <el-select v-model="searchData.staffId" clearable placeholder="请选择教师">
            <el-option value='' label="全部教师"></el-option>
            <el-option
              v-for="(item,index)  in staffData"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <StaffChart :dataGroup="groupData" :dataPlay="playData" width="80%"></StaffChart>
      <el-table :data="list"  border fit highlight-current-row style="width: 100%" ref="editTable">
        <el-table-column  prop="name" align="center" label="教师名称"></el-table-column>
        <el-table-column  prop="amount" align="center" label="总开出班次数"></el-table-column>
        <el-table-column  prop="groupEt" align="center" label="分组实验次数"></el-table-column>
        <el-table-column  prop="playEt" align="center" label="演示实验次数"></el-table-column>
        <el-table-column  prop="baseEt" align="center" label="基本实验次数"></el-table-column>
        <el-table-column  prop="expandEt" align="center" label="拓展实验次数"></el-table-column>
        <el-table-column  prop="schoolEt" align="center" label="校本实验次数"></el-table-column>
      </el-table>
    </div>
    </master-page>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getStaffCount } from 'api/count';
    import YearSelect from 'views/components/select/yearSelect';
    import StaffChart from 'components/Charts/staffChart';
    import TermSelect from 'views/components/select/termSelect';
    import MasterPage from 'views/layout/MasterPage';
    import { getunitStaff } from 'api/arrange';
    import {scrollTable} from "utils/index"
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    export default {
      name: 'staffCount',
      components: {StaffChart, YearSelect, TermSelect, MasterPage},
      data() {
        return {
          list: null,
          searchData:{
            year:'',
            term:'',
            staffId:''
          },
          groupData:[0,0,0,0,0,0,0,0,0,0,0,0],
          playData:[0,0,0,0,0,0,0,0,0,0,0,0],
          staffData:[]
        };
      },
      created() {
        getunitStaff().then(response => {
          this.staffData = response;
        });
      },
      methods : {
        getData() {
          getStaffCount(this.searchData).then(res => {
            this.list = res.staffReports;
            var monthVal = res.staffMonthReports;
            this.groupData = new Array(12);
            this.playData = new Array(12);
            for(let i=0;i<monthVal.length;i++){
              let val = Number(monthVal[i].month);
              let groupVal = Number(monthVal[i].groupEt);
              let playVal = Number(monthVal[i].playEt);
              this.groupData.splice(val-1,1,groupVal);
              this.playData.splice(val-1,1,playVal);
            }
            for(let i=0;i<4;i++){
              this.groupData.unshift(this.groupData.pop());
              this.playData.unshift(this.playData.pop());
            }
          });
        },
        changeYear(year){
          this.searchData.year = year;
        },
        changeTerm(term){
          this.searchData.term = term;
        },
        findItem() {
          this.getData();
        }
      },
      mounted() {
        scrollTable(".staffCount");
        this.searchData.year = this.$store.state.commonData.nowYear;
        this.getData();
      }
    }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container { font-family: '微软雅黑';
}
.home-p {
  width: 100%;
  border-bottom: 1px solid #e1e4e3;
  line-height: 1.6em;
  font-size: 14px;
}
.chart {
  width: 100%;
}
.charts-contain {
  width: 80%;
  margin: 0 auto;
}
</style>
