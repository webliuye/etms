<template>
    <div class="dashboard-container  openCountSubject">
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
        <el-row :gutter="24">
          <el-col :span="8">
            <div class="rank">
              <div>
                <p>总开出率：</p>
                <el-progress :text-inside="true" :stroke-width="24" :percentage="rateObj.totalRate" status="exception"></el-progress>
              </div>
              <div>
                 <p>分组实验 开出率：</p>
                 <el-progress :text-inside="true" :stroke-width="24" :percentage="rateObj.groupRate" status="success"></el-progress>
              </div>
              <div>
                <p>演示实验 开出率：</p>
                <el-progress :text-inside="true" :stroke-width="24" :percentage="rateObj.demoRate"></el-progress>
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <TeacherChart  className="course-info" :dataX="teacherName" :titleObj="barTitle" :dataNum="teacherData" id="course-info" :style="{width:'100%',height:'260px'}"></TeacherChart>
          </el-col>
        </el-row>
      </div>
      <el-table :data="list"  border fit highlight-current-row style="width: 100%" ref="editTable">
        <el-table-column  prop="subjectName" align="center" label="科目" min-width="80"></el-table-column>
        <el-table-column  prop="gradeName" align="center" label="年级" min-width="90"></el-table-column>
        <el-table-column  prop="termName" align="center" label="学期" min-width="80"></el-table-column>
        <el-table-column  align="center" label="分组实验">
          <el-table-column  prop="groupYinNum" align="right" label="应开数"  min-width="80"></el-table-column>
          <el-table-column  prop="groupFactNum" align="right" label="实开数"  min-width="80"></el-table-column>
          <el-table-column  prop="groupRate" align="right" label="开出率"  min-width="100" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.groupRate | numberTrans}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column  align="center" label="演示实验">
          <el-table-column  prop="demoYinNum" align="right" label="应开数"  min-width="80"></el-table-column>
          <el-table-column  prop="demoFactNum" align="right" label="实开数"  min-width="80"></el-table-column>
          <el-table-column  prop="demoRate" align="right" label="开出率"  min-width="100" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.demoRate | numberTrans}}</span>
            </template>
          </el-table-column>
        </el-table-column>
       <!--  <el-table-column  prop="groupRate" align="center" label="必做开出率" min-width="130" sortable></el-table-column>
        <el-table-column  prop="groupRate" align="center" label="选做开出率" min-width="130" sortable></el-table-column> -->
        <el-table-column  prop="totalRate" align="right" label="总开出率" min-width="120" sortable>
          <template slot-scope="scope">
              <span>{{scope.row.totalRate | numberTrans}}</span>
            </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    import TeacherChart from 'components/Charts/teacherChart';
    import YearSelect from 'views/components/select/yearSelect';
    import TermSelect from 'views/components/select/termSelect';
    import { mapGetters } from 'vuex';
    import { getMangeOpenDate, getSubjectOpenDate, getSchoolOpenDate } from 'api/index';
    import { openCountAll } from 'api/count';
    import {numberTransTwo, changeDate, numberTransValue} from 'src/filters';
    import {scrollTable} from "utils/index"
    export default {
      name: 'openRecord',
      components: { YearSelect, TermSelect, TeacherChart},
      data() {
        return {
          listLoading: true,
          rateObj:{
            totalRate:0,
            groupRate:0,
            demoRate:0
          },
          listLoading: true,
          list: null,
          teacherName:[],
          teacherData:{
            group:[],
            demo:[]
          },
          barTitle: {
              text: '各科目开出率',
              left: 'center',
              top: '12px',
              textStyle: {
                  fontWeight: 'bold',
                  fontSize: '14'
              }
          },
          searchData:{
            term:null,
            termYear:null,
            year:null
          }
        }
      },
      created() {
        this.getList();
      },
      methods : {
        getList() { // 获取表格数据
          getSchoolOpenDate(this.searchData).then(res => {
            this.list=res;
          });
          this.getCountAll();
          this.getTypeAll();
          this.getSubjectAll();
        },
        getCountAll() {   //获取总开出率
          openCountAll(this.searchData).then(res => {
            if(res && res.length > 0){
              this.rateObj.totalRate = numberTransTwo(res[0].finalAmount,res[0].totalAmount);
            }
          });
        },
        getTypeAll() {  //获取分组演示开出率
          var vm = this;
          var data = jQuery.extend({},this.searchData,{groups:'catalogueType'});
          openCountAll(data).then(res => {
            if(res && res.length > 0){
              res.forEach(function(s){
                if(s.catalogueType == '1'){
                  vm.rateObj.groupRate = numberTransTwo(s.finalAmount,s.totalAmount);
                }else if(s.catalogueType == '2'){
                  vm.rateObj.demoRate = numberTransTwo(s.finalAmount,s.totalAmount);
                }
              });
            }
          });
        },
        getSubjectAll() {  //获取各科目开出率
          var vm = this;
          var data = jQuery.extend({},this.searchData,{groups:'subject,catalogueType'});
          openCountAll(data).then(res => {
            this.teacherName = [];
            this.teacherData.group = [];
            this.teacherData.demo = [];
            if(res && res.length > 0){
              res.forEach(function(s){
                if(s.catalogueType == '1'){
                  vm.teacherName.push(s.subjectName);
                  vm.teacherData.group.push(numberTransTwo(s.finalAmount,s.totalAmount));
                }else if(s.catalogueType == '2'){
                  vm.teacherData.demo.push(numberTransTwo(s.finalAmount,s.totalAmount));
                }
              });
            }
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
            const tHeader = ['科目','年级','学期','分组应开数','分组实开数','分组开出率(%)','演示应开数','演示实开数','演示开出率(%)','总开出率(%)'];
            const filterVal = ['subjectName','gradeName','termName','groupYinNum','groupFactNum','groupRate','demoYinNum','demoFactNum','demoRate','totalRate'];
            const list = JSON.parse(JSON.stringify(this.list));
            list.forEach(function(s){
              s.groupRate = numberTransValue(s.groupRate);
              s.demoRate = numberTransValue(s.demoRate);
              s.totalRate = numberTransValue(s.totalRate);
            });
            var name = changeDate(new Date()) + "科目开出统计";
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
        scrollTable('.openCountSubject')
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
.rank{
    height:250px;
    padding: 16px 0;
    font-size:12px;
}
</style>
