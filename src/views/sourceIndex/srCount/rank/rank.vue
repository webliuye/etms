<template>
<master-page title="实验开出排行">
  <div class="filter-container srcRank">
    <div class="version-div">
      <div v-if="orgType!='223'" class="left-tree"  style="max-height:640px;position:absolute;">
        <AreaTree :isSchool="false"  @changeCode="changeCode"></AreaTree>
      </div>
      <div :class="{right_content:orgType!='223'}">
        <div class="dashboard-container" >
          <div class="search-select" >
            <el-button type="primary" @click="handleDownload">导出</el-button>
            <div class="fr selectwidth1">
              <TermSelect @changeTerm="changeTerm"></TermSelect>
            </div>
            <div class="fr selectwidth">
              <YearSelect @changeYear="changeYear"></YearSelect>
            </div>
          </div>
        <div class="chartDiv table-div">
            <el-row :gutter="24">
              <el-col :span="6">
                <div class="rank">
                    <div ><p style="font-weight:bold">总开出率：</p><el-progress :text-inside="true" :stroke-width="24" :percentage="rateObj.totalRate" status="exception"></el-progress></div>
                     <div><p>分组实验 开出率：</p><el-progress :text-inside="true" :stroke-width="24" :percentage="rateObj.groupRate" status="success"></el-progress></div>
                    <div><p>演示实验 开出率：</p><el-progress :text-inside="true" :stroke-width="24" :percentage="rateObj.demoRate"></el-progress></div>
                </div>
              </el-col>
              <el-col :span="18">
                  <TeacherChart  className="course-info" :dataX="teacherName" :titleObj="barTitle" :dataNum="teacherData" id="course-info" :style="{width:'100%',height:'260px'}"></TeacherChart>
              </el-col>
          </el-row>
          <el-table :data="list"  border fit highlight-current-row style="width: 100%;" ref="editTable" class="table-all ">
          <el-table-column  type="index" align="center" label="排行" width="60"></el-table-column>
          <el-table-column  prop="unitName" label="单位" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="classNum" align="right" label="班级数" min-width="74"></el-table-column>
          <el-table-column  align="center" label="分组实验">
            <el-table-column  prop="groupTotalAmount" align="right" label="应开数" min-width="74"></el-table-column>
            <el-table-column  prop="groupFinalAmount" align="right" label="实开数" min-width="74"></el-table-column>
            <el-table-column  prop="groupNumber" align="right" label="开出率" sortable min-width="94">
              <template slot-scope="scope">
                <span>{{scope.row.groupNumber | numberTrans}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column  align="center" label="演示实验">
            <el-table-column  prop="demoTotalAmount" align="right" label="应开数" min-width="74"></el-table-column>
            <el-table-column  prop="demoFinalAmount" align="right" label="实开数" min-width="74"></el-table-column>
            <el-table-column  prop="demoNumber" align="right" label="开出率" sortable min-width="94">
              <template slot-scope="scope">
                <span>{{scope.row.demoNumber | numberTrans}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column  prop="totalRate" align="right" sortable label="总开出率" min-width="106">
            <template slot-scope="scope">
                <span>{{scope.row.totalRate | numberTrans}}</span>
              </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
      </div>
    </div>
  </div>
</master-page>
</template>

<script>
    import YearSelect from 'views/components/srcSelect/yearSelect';
    import TermSelect from 'views/components/srcSelect/termSelect';
    import { mapGetters } from 'vuex';
    // import { getMangeOpenDate, getSubjectOpenDate, getAllOpenDate } from 'api/sourceIndex';
    import { openCountAll, getOpenCountAllTable } from 'api/sourceIndex';
    import MasterPage from 'views/layout/MasterPage1';
    import TeacherChart from 'components/Charts/teacherChart';
    import AreaTree from 'views/components/areaTree1';
    import {numberTransTwo, changeDate, numberTransValue} from 'src/filters';
    import { scrollTable } from 'utils/index'
    export default {
      name: 'openRecord',
      components: {  YearSelect, TermSelect, MasterPage, TeacherChart, AreaTree},
      data() {
        return {
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
              top: '10px',
              textStyle: {
                  fontWeight: 'bold',
                  fontSize: '12'
              }
          },
          searchData:{
            unitId:null,
            term:null,
            // orgType:null,
            year:null
          },
          orgId:this.$store.state.commonData.userUnit.unitId,
          orgType:this.$store.state.commonData.userUnit.unitType,
        }
      },
      created() {
        this.searchData.unitId = this.$store.state.commonData.userUnit.unitId,
        // this.searchData.orgType = this.$store.state.commonData.userUnit.unitType,
        this.getList();
      },
      methods : {
        getList() { // 获取表格数据
          var t = jQuery.extend({},this.searchData,{groups:'catalogueType'});
          getOpenCountAllTable(t).then(res => {
            if(res && res.length > 0){
              res.forEach(function(s){
                if(s.counts && s.counts.length > 0){
                  s.counts.forEach(function(t){
                    if(t.catalogueType == 1){
                      s.groupFinalAmount = t.finalAmount;
                      s.groupTotalAmount = t.totalAmount;
                      s.groupNumber = t.rate;
                    }else if(t.catalogueType == 2){
                      s.demoFinalAmount = t.finalAmount;
                      s.demoTotalAmount = t.totalAmount;
                      s.demoNumber = t.rate;
                    }
                  });
                }
              });
              this.list = res;
            }
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
          var data = jQuery.extend({},this.searchData,{groups:'subject,catalogueType,stage'});
          openCountAll(data).then(res => {
          this.teacherName = [];
          this.teacherData.group = [];
          this.teacherData.demo = [];
            if(res && res.length > 0){
              res.forEach(function(s){
                if(s.catalogueType == '1'){
                  vm.teacherName.push(s.stageName + s.subjectName);
                  vm.teacherData.group.push(numberTransTwo(s.finalAmount,s.totalAmount));
                }else if(s.catalogueType == '2'){
                  vm.teacherData.demo.push(numberTransTwo(s.finalAmount,s.totalAmount));
                }
              });
              //$.unique(vm.teacherName);
            }
          });
        },
        changeYear(year){
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
        changeCode(data){
          this.searchData.unitId = data.unitId;
          // this.searchData.orgType = data.unitType;
          this.getList();
        },
        handleDownload() {
            require.ensure([], () => {
              const { export_json_to_excel } = require('vendor/Export2Excel');
              const tHeader = ['排行','单位','班级数','应开数','实开数','开出率(%)','应开数','实开数','开出率(%)','总开出率(%)'];
              const filterVal = ['rank','unitName','classNum','yinGroupNum','factGroupNum','groupOpenRate','yinDemoNum','factDemoNum','demoOpenRate','totalOpenRate'];
              const list = JSON.parse(JSON.stringify(this.list));
              list.forEach(function(s, index){
                s.rank = index + 1;
                s.groupOpenRate = numberTransValue(s.groupOpenRate);
                s.demoOpenRate = numberTransValue(s.demoOpenRate);
                s.totalOpenRate = numberTransValue(s.totalOpenRate);
              });
              var name = changeDate(new Date()) + "实验开出排行";
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
        scrollTable('.srcRank');
      }
    }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container { font-family: '微软雅黑';

}
.rank{
    height:250px;
    font-size:12px;
}
.home-p {
  width: 100%;
  border-bottom: 1px solid #eee;
  line-height: 1.6em;
  font-size: 14px;
}
.right { float: right; display: inline;}
.expert-info {
  margin: 0 auto;
}
.course-info {
  margin: 0 auto;

}
.top-button {
  display: block;
  overflow: hidden;
}
</style>
