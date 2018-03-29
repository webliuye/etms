<template>
    <div class="dashboard-container openCountTeacher">
      <div class="search-select">
        <el-button type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
        <div class="fr selectwidth">
          <TermSelect @changeTerm="changeTerm"></TermSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <div>
        <TeacherChart  className="course-info" :dataX="teacherName" :titleObj="barTitle" :dataNum="teacherData" id="course-info" :style="{width:'100%',height:'260px'}"></TeacherChart>
      </div>
      <el-table :data="list" border fit highlight-current-row style="width: 100%" ref="editTable" class="table-all">
        <el-table-column  prop="name" label="教师名称" min-width="200"></el-table-column>
        <el-table-column  align="center" label="分组实验">
          <el-table-column  prop="mustGroupEt" align="right" label="应开数"  min-width="80"></el-table-column>
          <el-table-column  prop="factGroupEt" align="right" label="实开数"  min-width="80"></el-table-column>
          <el-table-column  prop="groupRate" align="right" label="开出率"  min-width="100" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.groupRate | numberTrans}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column  align="center" label="演示实验">
          <el-table-column  prop="mustDemoEt" align="right" label="应开数"  min-width="80"></el-table-column>
          <el-table-column  prop="factDemoEt" align="right" label="实开数"  min-width="80"></el-table-column>
          <el-table-column  prop="demoRate" align="right" label="开出率"  min-width="100" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.demoRate | numberTrans}}</span>
            </template>
          </el-table-column>
        </el-table-column>
         <el-table-column  prop="rate" align="right" label="总开出率" min-width="120" sortable>
          <template slot-scope="scope">
              <span>{{scope.row.rate | numberTrans}}</span>
            </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    import TeacherChart from 'components/Charts/teacherChartOne';
    import YearSelect from 'views/components/select/yearSelect';
    import TermSelect from 'views/components/select/termSelect';
    import { mapGetters } from 'vuex';
    import { getRoomCount, getInfo, getSchoolOpen,getSchoolOpenData} from 'api/count';
    import {numberTransTwo, changeDate, numberTransValue} from 'src/filters';
    import { getStaffCount } from 'api/count';
    import {scrollTable} from "utils/index"
    export default {
      name: 'openRecord',
      components: { YearSelect, TermSelect, TeacherChart},
      data() {
        return {
          listLoading: true,
          list: null,
          searchData:{
            termYear:null,
            year:null,
            term:null,
            baseCatalogId:null
          },
          teacherName:[],
          teacherData:{
            group:[],
            demo:[]
          },
          barTitle: {
              text: '实验开出统计(按教师)',
              left: 'center',
              top: '12px',
              textStyle: {
                  fontWeight: 'bold',
                  fontSize: '14'
              }
          }
        }
      },
      created() {
        this.orgType = this.$store.state.user.userInfo.orgType;
        this.orgId = this.$store.state.user.userInfo.orgId;
        this.getList();
      },
      methods : {
        getList() { // 获取表格数据
          getStaffCount(this.searchData).then(res => {
            this.list = res.staffReports;
            var vm = this;
            this.teacherName = [];
            this.teacherData.group = [];
            this.teacherData.demo = [];
            res.staffReports.forEach(function(item){
              vm.teacherName.push(item.name);
              vm.teacherData.group.push(item.factGroupEt);
              vm.teacherData.demo.push(item.factDemoEt);
            });
          });
        },
        changeYear(year){
          this.searchData.termYear = year;
          this.searchData.year = year;
          this.findItem();
        },
        changeTerm(term){
          this.searchData.term = term;
          this.findItem();
        },
        findItem() {
          this.getList();
        },
        handleDownload(){
          require.ensure([], () => {
            const { export_json_to_excel } = require('vendor/Export2Excel');
            const tHeader = ['教师名称','分组应开数','分组实开数','分组开出率(%)','演示应开数','演示实开数','演示开出率(%)','总开出率(%)'];
            const filterVal = ['name','mustGroupEt','factGroupEt','groupRate','mustDemoEt','factDemoEt','demoRate','rate'];
            const list = JSON.parse(JSON.stringify(this.list));
            list.forEach(function(s){
              s.groupRate = numberTransValue(s.groupRate);
              s.demoRate = numberTransValue(s.demoRate);
              s.rate = numberTransValue(s.rate);
            });
            var name = changeDate(new Date()) + "教师开出统计";
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, name);
          });
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        }
      },
      mounted() {
         scrollTable('.openCountTeacher')
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
.right { float: right; display: inline;}
.table-all { margin-top: 20px;}
.expand {
  padding: 0 0 0 50px;
}
.table-in {
  border: none;
  box-sizing: border-box;
  width: 100%;
  td {
     border:1px solid #ccc;
     text-align: center;
  }
}
.course-info {
  margin: 0 auto;

}
</style>
