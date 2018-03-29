<template>
	<master-page title="考核统计">
		<div class="dashboard-container">
			<div class="version-div">
        <div v-if="orgType!='223'" class="left-tree"  style="max-height:640px;">
          <AreaTree @changeCode="changeCode" :isSchool="false"></AreaTree>
        </div>
      </div>
      <div :class="{right_content:orgType!='223'}">
      	<div class="search-select" style="padding-bottom:0;">
          <!-- <div class="fr selectwidth">
            <TermSelect @changeTerm="changeTerm"></TermSelect>
          </div> -->
          <div class="fr selectwidth" style="margin-bottom:0;">
            <YearSelect @changeYear="changeYear"></YearSelect>
          </div>
        </div>
        <div class="lineChart" v-loading.body="loading">
        	<NormalChart :style="{width:'100%',height:'260px'}"  :titleObj="barTitle" :dataX="problemName"  :dataName="accuracyName" :dataNum="problemData"></NormalChart>
        </div>
        <div class="table-div checkSheet">
        	<el-table :data="list" fit highlight-current-row style="width: 100%" ref="list">
        		<el-table-column  type="index" align="center" label="排名" width="70"></el-table-column>
        		<el-table-column  prop="unitName" label="所属地区" min-width="140" show-overflow-tooltip></el-table-column>
        		<el-table-column  prop="teacherNum" align="right" label="教师人数" min-width="88" show-overflow-tooltip></el-table-column>
        		<el-table-column  prop="questionTotalNum" align="right" label="做题数" min-width="76" show-overflow-tooltip></el-table-column>
        		<el-table-column  prop="averageNum" align="right" label="人均做题数" min-width="100" show-overflow-tooltip></el-table-column>
        		<el-table-column  prop="rightLevel" align="right"   label="正确率" min-width="80"   show-overflow-tooltip></el-table-column>
        		<el-table-column  prop="lastTime" label="最后做题时间" align="center" min-width="120" show-overflow-tooltip></el-table-column>
        	</el-table>
        </div>
      </div>
		</div>
	</master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
import AreaTree from "views/components/areaTree";
import YearSelect from "views/components/srcSelect/yearSelect";
import TermSelect from "views/components/select/termSelect";
import NormalChart from "components/Charts/normalChart";
import { getTestCount, getTestMap } from "api/test";
import { scrollTable }  from 'utils/index'
import {numberTransTwo} from 'src/filters';
export default {
  components: { MasterPage, AreaTree, YearSelect, TermSelect, NormalChart },
  data() {
    return {
      listLoading: true,
      listData: [],
      loading: false,
      searchData: {
        termYear: null,
        // term : null,
        unit: "",
        unitType: ""
      },
      problemName: [
        "9月",
        "10月",
        "11月",
        "12月",
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月"
      ],
      accuracyName: ["正确率"],
      orgType: this.$store.state.user.userInfo.orgType,
      problemData: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      barTitle: {
        text: "学年正确率",
        left: "center",
        top: "32",
        textStyle: {
          fontSize: "12",
          height: "12"
        }
      }
    };
  },
  computed: {
    list: function() {
      var arr = this.listData;
      var compare = function(obj1, obj2) {
        var val1 = parseFloat(obj1.rightLevel);
        var val2 = parseFloat(obj2.rightLevel);
        if (val1 > val2) {
          return -1;
        } else if (val1 < val2) {
          return 1;
        } else {
          return 0;
        }
      };
      return arr.sort(compare);
    }
  },
  created() {
    this.searchData.unit = this.$store.state.user.userInfo.orgId;
    this.searchData.unitType = this.$store.state.user.userInfo.orgType;
    this.getList();
    this.getMap();
  },
  methods: {
    getMap() {
      var vm = this;
      var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      getTestMap(this.searchData).then(res => {
        res.forEach(e => {
          let month = Number(e.month);
          let val = numberTransTwo(e.questionRightTotalNum, e.questionTotalNum);
          if (month) {   //防止NaN
            if (month < 9) {
              arr[month + 4] = val;
            } else {
              arr[month - 9] = val;
            }
          }
          // vm.problemName.forEach((t, index) => {
          //   if (t.indexOf(e.month) != -1) {
          //     if (e.month == 1) {
          //       if (e.questionRightTotalNum == 0) {
          //         arr[4] = 0;
          //       } else {
          //         arr[4] =
          //           parseInt(
          //             e.questionRightTotalNum / e.questionTotalNum * 10000
          //           ) / 100;
          //       }
          //     } else if (e.month == 2) {
          //       if (e.questionRightTotalNum == 0) {
          //         arr[5] = 0;
          //       } else {
          //         arr[5] =
          //           parseInt(
          //             e.questionRightTotalNum / e.questionTotalNum * 10000
          //           ) / 100;
          //       }
          //     } else {
          //       if (e.questionRightTotalNum == 0) {
          //         arr[index] = 0;
          //       } else {
          //         arr[index] =
          //           parseInt(
          //             e.questionRightTotalNum / e.questionTotalNum * 10000
          //           ) / 100;
          //       }
          //     }
          //   }
          // });
        });
        vm.problemData = [arr];
      });
      // this.loading = true;
      // setTimeout(() => {
      //   vm.loading = false;
      // }, 500);
    },
    getList() {
      getTestCount(this.searchData).then(res => {
        res.forEach(function(e) {
          e.lastTime = e.lastTime || "无";
          if (e.teacherNum == 0) {
            e.averageNum = e.questionTotalNum;
          } else {
            if (e.questionTotalNum == 0) {
              e.averageNum = 0;
            } else {
              e.averageNum =
                parseInt(e.questionTotalNum / e.teacherNum * 10) / 10;
            }
          }
          if (e.questionRightTotalNum == 0) {
            e.rightLevel = 0;
          } else {
            e.rightLevel =
              parseInt(e.questionRightTotalNum / e.questionTotalNum * 10000) /
                100 +
              "%";
          }
        });
        this.listData = res;
      });
    },
    changeCode(data) {
      this.searchData.unit = data.unitId;
      this.searchData.unitType = data.unitType;
      this.getList();
      this.getMap();
    },
    changeYear(year) {
      this.searchData.termYear = year;
      this.getList();
      this.getMap();
    },
    changeTerm(term) {
      this.searchData.term = term;
      this.getList();
    }
  },
  mounted(){
    scrollTable('.checkSheet');
  }
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>

</style>
