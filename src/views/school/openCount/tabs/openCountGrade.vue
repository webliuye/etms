<template>
    <div class="dashboard-container openCountGrade">
      <div class="search-select">
        <el-button type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
        <div class="fr selectwidth">
          <TermSelect @changeTerm="changeTerm"></TermSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <el-table :data="list" border fit highlight-current-row style="width: 100%" ref="editTable"   :span-method="objectSpanMethod"  class="table-all">

        <el-table-column  prop="type" align="center" label="实验类别"  min-width="80"></el-table-column>
        <el-table-column  prop="mustChose" align="center" label="统计类别"  min-width="80"></el-table-column>
        <el-table-column  align="center" label="科学">
             <el-table-column  prop="techxx" align="right" label="小学"  min-width="80"></el-table-column>
             <el-table-column  prop="techcz" align="right" label="初中"  min-width="80"></el-table-column>
             <el-table-column  prop="techAll" align="right" label="合计"  min-width="80"></el-table-column>
        </el-table-column>
        <el-table-column  align="center" label="物理">
             <el-table-column  prop="phycz" align="right" label="初中"  min-width="80"></el-table-column>
             <el-table-column  prop="phygz" align="right" label="高中"  min-width="80"></el-table-column>
             <el-table-column  prop="phyAll" align="right" label="合计"  min-width="80"></el-table-column>
        </el-table-column>
        <el-table-column  align="center" label="化学">
             <el-table-column  prop="chemcz" align="right" label="初中"  min-width="80"></el-table-column>
             <el-table-column  prop="chemgz" align="right" label="高中"  min-width="80"></el-table-column>
             <el-table-column  prop="chemAll" align="right" label="合计"  min-width="80"></el-table-column>
        </el-table-column>
        <el-table-column  align="center" label="生物">
             <el-table-column  prop="biocz" align="right" label="初中"  min-width="80"></el-table-column>
             <el-table-column  prop="biogz" align="right" label="高中"  min-width="80"></el-table-column>
             <el-table-column  prop="bioAll" align="right" label="合计"  min-width="80"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    import YearSelect from 'views/components/select/yearSelect';
    import TermSelect from 'views/components/select/termSelect';
    import { mapGetters } from 'vuex';
    import {changeDate, numberTransValue} from 'src/filters';
    import { getGradeCount } from 'api/count';
    import {scrollTable} from "utils/index"
    export default {
      name: 'openRecord',
      components: { YearSelect, TermSelect},
      data() {
        return {
          list: null,
          searchData:{
            termYear:null,
            term:null
          }
        }
      },
      created() {
        this.orgType = this.$store.state.user.userInfo.orgType;
        this.orgId = this.$store.state.user.userInfo.orgId;
        // this.getList();
          this.list=[
              {type:'分组实验',mustChose:'必做应开数',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'分组实验',mustChose:'必做实开数',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'分组实验',mustChose:'必做开出率',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'分组实验',mustChose:'选做应开数',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'分组实验',mustChose:'选做实开数',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'分组实验',mustChose:'选做开出率',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'演示实验',mustChose:'必做应开数',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'演示实验',mustChose:'必做实开数',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'演示实验',mustChose:'必做开出率',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'演示实验',mustChose:'选做应开数',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'演示实验',mustChose:'选做实开数',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'},
              {type:'演示实验',mustChose:'选做开出率',techxx:'212',techcz:'312',techAll:'524',phycz:'212',phygz:'312',phyAll:'524',chemcz:'212',chemgz:'312',chemAll:'524',biocz:'212',biogz:'312',bioAll:'524'}

            ]
      },
      methods : {
        getList() { // 获取表格数据
          getGradeCount(this.searchData).then(res => {
            this.list=res;

          });
        },
        changeYear(year){
          this.searchData.termYear = year;
          this.getList();
        },
        changeTerm(term){
          this.searchData.term = term;
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
        },
         objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 6 === 0) {
            return {
              rowspan: 6,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
      },
      mounted() {
         scrollTable('.openCountGrade')
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
