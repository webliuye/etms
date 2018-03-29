<template>
    <div class="dashborad">
       <el-row :gutter="16">
            <el-col :span="24">
                <div class="grid-content">
                    <div class="title">实验开出情况</div>
                    <div >
                        <el-row :gutter="24">
                            <el-col :span="8" >
                                <div class="rank">
                                    <div ><p style="font-weight:bold">总开出率：</p><el-progress :text-inside="true" :stroke-width="24" :percentage="rateObj.totalRate" status="exception"></el-progress></div>
                                     <div><p>分组实验 开出率：</p><el-progress :text-inside="true" :stroke-width="24" :percentage="rateObj.groupRate" status="success"></el-progress></div>
                                    <div><p>演示实验 开出率：</p><el-progress :text-inside="true" :stroke-width="24" :percentage="rateObj.demoRate"></el-progress></div>
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <TeacherChart  className="course-info" :dataX="teacherName" :titleObj="barTitle" :dataNum="teacherData" id="course-info" :style="{width:'100%',height:'260px'}"></TeacherChart>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <div class="title">实验开出TOP10</div>
                            </el-col>
                            <el-col :span="12">
                                <a href="javascript:;" @click="toRouter" class="el-button--text fr" style="font-size:12px;">更多</a>
                            </el-col>
                            <el-col :span="24">
                                <el-table :data="tableData" style="width: 100%">
                                    <el-table-column type="index" label="排行" width="100" align="center"> </el-table-column>
                                    <el-table-column prop="name" label="单位" min-width="180" align="left"> </el-table-column>
                                    <el-table-column prop="totalOpenRate" label="开出率" min-width="400" sortable align="right">
                                        <template slot-scope="scope">
                                          <span>{{scope.row.totalOpenRate}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
        </el-row>
       <div v-if="bigData" class="visual" @click="goVisual">大数据分析系统>></div>
    </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import TeacherChart from 'components/Charts/teacherChart';
  import { getMangeOpenDate, getSubjectOpenDate, getAllOpenDate } from 'api/index';
  import { getSchoolOpenData,getMineData,getManageData,getRankData, openCountAll, getOpenCountTop10} from 'api/count';
  import {numberTransTwo} from '../../../filters';
  import { getInfo, getClass, getStaffSubject } from 'api/manageCenter';
  import { getTableList } from 'api/guides';
  export default {
    name: 'Manager',
    data() {
      return {
        bigData:true,
        rateObj:{
          totalRate:0,
          groupRate:0,
          demoRate:0
        },
        tableData:[],
        teacherName: [],
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
          orgType:null
        },
        orgType:this.$store.state.user.userInfo.orgType,
        orgId:this.$store.state.user.userInfo.orgId
      }
    },
    components: {
        TeacherChart
    },
    methods: {
        toRouter(){
            this.$router.push({ path: '/rank' });
        },
        getRate() {
          getMangeOpenDate().then(res => {
            this.rateObj.totalRate = parseInt(res.totalRate.toFixed(4) * 10000)/100;
            this.rateObj.groupRate =parseInt(res.groupRate.toFixed(4) * 10000)/100;
            this.rateObj.demoRate = parseInt(res.demoRate.toFixed(4) * 10000)/100;
          });
        },
        getTableData(){
          getAllOpenDate(this.searchData).then(res => {
            this.tableData = res.slice(0,10);
          });
        },
        getSubjectData() {
          getSubjectOpenDate().then(res => {
            var vm = this;
            res.forEach(function(item){
              vm.teacherName.push(item.subjectName);
              vm.teacherData.group.push(parseInt(item.groupRate * 10000)/100);
              vm.teacherData.demo.push(parseInt(item.demoRate * 10000)/100);
            });
          });
        },
        clickChart() {},
        goVisual(){
          this.$router.push({path:'/visual'});
        }
    },
    created() {
      if(this.$store.getters.objApi){
        this.bigData = this.$store.getters.objApi.BIGDATA;
      }
      var vm = this;
      this.searchData.unitId = this.$store.state.user.userInfo.orgId;
      this.searchData.orgType = this.$store.state.user.userInfo.orgType;
      openCountAll().then(res => {
        if(res && res.length > 0){
          this.rateObj.totalRate = numberTransTwo(res[0].finalAmount,res[0].totalAmount);
        }
      });
      openCountAll({groups:'catalogueType'}).then(res => {
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
      openCountAll({groups:'subject,catalogueType,stage'}).then(res => {
        if(res && res.length > 0){
          res.forEach(function(s){
            if(s.catalogueType == '1'){
              vm.teacherName.push(s.stageName + s.subjectName);
              vm.teacherData.group.push(numberTransTwo(s.finalAmount,s.totalAmount));
            }else if(s.catalogueType == '2'){
              vm.teacherData.demo.push(numberTransTwo(s.finalAmount,s.totalAmount));
            }
          });
        }
      });
      getOpenCountTop10().then(res => {
        res.forEach(function(s){
          const t = numberTransTwo(s.finalAmount,s.totalAmount);
          s.totalOpenRate = t > 0?t + '%':t;
        });
        this.tableData = res;
      });

      // this.getRate();
      // this.getSubjectData();
      // this.getTableData();
    }
  }
</script>
<style  rel="stylesheet/less" lang="less" scoped>
@base-bg: #00a0e9;
@hoverColor: #00a0e9;
ul li {
    list-style-type:none;
}
ul {
    margin: 0;
    padding: 0;
}
.dashborad {
    padding: 8px;
    position:relative;
    .agent-item {
        color: @base-bg;
        .el-col {
            position: relative;
            // text-align: center;
            &::before {
                border-left: 2px solid #adb2b5;
                content: "";
                height: 50px;
                left: 0;
                margin-top: 8px;
                position: absolute;
            }
        }
        .count-top {
            font-size: 13px;
        }
        .count {
            font-size: 24px;
            line-height: 40px;
            cursor: pointer;
        }
    }
}
.grid-content {
    border: 1px solid #d3dce6;
    margin-bottom: 16px;
    background: #fff;
    padding: 24px;
    .rank{
        height:240px;
        padding: 0;
        font-size:12px;
    }
    .title {
        margin-bottom: 16px;
        font-weight: bold;
        font-size: 14px;
    }

    .notice-content {
        padding-left: 56px;
        width: 100%;
        background: url(../../../assets/img/notice-back.png) left 4px no-repeat;
        .notice-title {
            font-size: 12px;
            color: #666;
            font-weight: 400;
            &:hover {
                color:@hoverColor;
            }
        }
    }
}

.notice ul li {
    margin: 10px 0;
    line-height: 26px;
}
.notice-color:hover {
    color:@hoverColor;
}
.notice .notice-more {
    text-align: right;
    display: block;
    &:hover {
        color:@hoverColor;
    }
}
.course-info{
    width:400px;
    height:200px;
}
.el-progress-bar__innerText{
    line-height: 24px!important;
}
.visual{
  position:absolute;
  top:24px;
  right:32px;
  color: #00a0e9;
  line-height:16px;
  font-size:14px;
  background: url(../../../assets/visual/data-circle.png)  no-repeat;
  background-size: 16px 16px;
  padding-left:18px;
  cursor:pointer;
}
</style>
