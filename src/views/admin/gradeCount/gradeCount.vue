<template>
		<div class="filter-container">
			<div class="search-select">
        <div class="fr selectwidth1">
          <el-select v-model="searchData.section" @change="getList" clearable placeholder="选择学段">
            <el-option label="小学" value="1"></el-option>
            <el-option label="初中" value="2"></el-option>
            <el-option label="高中" value="3"></el-option>
          </el-select>
        </div>
        <div class="fr selectwidth">
          <TermSelect @changeTerm="changeTerm"></TermSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <div>
        <NormalChart :style="{width:'100%',height:'260px'}" :titleObj="barTitle" :dataX="subjectName" :dataName="learnName" :dataNum="subjectData" :chartColor="chartColor"></NormalChart>
      </div>
      <div class="table-div gradeCount">
        <table cellpadding="0" cellspacing="0" class="table-in2 gradeCountTable">
          <thead>
            <tr>
              <td style="width:10%;" :rowspan="2">所属学段</td>
              <td style="width:10%;" :rowspan="2">学科</td>
              <td style="width:10%;" :rowspan="2">年级</td>
              <td style="width:30%;" :colspan="3">分组</td>
              <td style="width:30%;" :colspan="3">演示</td>
              <td style="width:10%; text-align:right;padding-right:16px;" :rowspan="2">完成率</td>
            </tr>
            <tr class="trOne">
              <td>应开数</td>
              <td>实开数</td>
              <td>完成率</td>
              <td>应开数</td>
              <td>实开数</td>
              <td>完成率</td>
            </tr>
          </thead>
        </table> 
        <table cellpadding="0" cellspacing="0" class="table-in2">  
          <tbody v-for="(item,index) in list" :key="index"  v-if="item.lengthOne > 0">
            <tr v-if="item.subLength > 0">
              <td style="width:10%;" class="tdTwo" :rowspan="item.lengthOne">{{item.sectionName}}</td>
              <td style="width:10%;" class="tdTwo" :rowspan="item.subjectData.length">科学</td>
              <td style="width:10%;" class="tdTwo">{{item.subjectData[0].gradeName}}</td>
              <td style="width:10%;">{{item.subjectData[0].groupMustNumber}}</td>
              <td style="width:10%;">{{item.subjectData[0].groupFactNumber}}</td>
              <td style="width:10%;">{{item.subjectData[0].groupRate | numberTrans}}</td>
              <td style="width:10%;">{{item.subjectData[0].domeMustNumber}}</td>
              <td style="width:10%;">{{item.subjectData[0].domeFactNumber}}</td>
              <td style="width:10%;">{{item.subjectData[0].domeRate | numberTrans}}</td>
              <td style="width:10%;">{{item.subjectData[0].rate | numberTrans}}</td>
            </tr>
            <tr v-for="(items,index) in item.subjectData" v-if="index != 0" :key="'00' + index">
              <td class="tdTwo">{{items.gradeName}}</td>
              <td>{{items.groupMustNumber}}</td>
              <td>{{items.groupFactNumber}}</td>
              <td>{{items.groupRate | numberTrans}}</td>
              <td>{{items.domeMustNumber}}</td>
              <td>{{items.domeFactNumber}}</td>
              <td>{{items.domeRate | numberTrans}}</td>
              <td>{{items.rate | numberTrans}}</td>
            </tr>
            <tr v-if="item.phyLength > 0">
              <td class="tdTwo" v-if="item.subLength <= 0" :rowspan="item.lengthOne">{{item.sectionName}}</td>
              <td class="tdTwo" :rowspan="item.physicsData.length">物理</td>
              <td class="tdTwo">{{item.physicsData[0].gradeName}}</td>
              <td>{{item.physicsData[0].groupMustNumber}}</td>
              <td>{{item.physicsData[0].groupFactNumber}}</td>
              <td>{{item.physicsData[0].groupRate | numberTrans}}</td>
              <td>{{item.physicsData[0].domeMustNumber}}</td>
              <td>{{item.physicsData[0].domeFactNumber}}</td>
              <td>{{item.physicsData[0].domeRate | numberTrans}}</td>
              <td>{{item.physicsData[0].rate | numberTrans}}</td>
            </tr>
            <tr v-for="(items,index) in item.physicsData" v-if="index != 0" :key="'11' + index">
              <td class="tdTwo">{{items.gradeName}}</td>
              <td>{{items.groupMustNumber}}</td>
              <td>{{items.groupFactNumber}}</td>
              <td>{{items.groupRate | numberTrans}}</td>
              <td>{{items.domeMustNumber}}</td>
              <td>{{items.domeFactNumber}}</td>
              <td>{{items.domeRate | numberTrans}}</td>
              <td>{{items.rate | numberTrans}}</td>
            </tr>
            <tr v-if="item.cheLength > 0" class="trOne">
              <td class="tdTwo" v-if="item.phyLength < 1 && item.subLength <= 0 " :rowspan="item.lengthOne">{{item.sectionName}}</td>
              <td class="tdTwo" :rowspan="item.chemistryData.length">化学</td>
              <td class="tdTwo">{{item.chemistryData[0].gradeName}}</td>
              <td>{{item.chemistryData[0].groupMustNumber}}</td>
              <td>{{item.chemistryData[0].groupFactNumber}}</td>
              <td>{{item.chemistryData[0].groupRate | numberTrans}}</td>
              <td>{{item.chemistryData[0].domeMustNumber}}</td>
              <td>{{item.chemistryData[0].domeFactNumber}}</td>
              <td>{{item.chemistryData[0].domeRate | numberTrans}}</td>
              <td>{{item.chemistryData[0].rate | numberTrans}}</td>
            </tr>
            <tr v-for="(items,index) in item.chemistryData" v-if="index != 0" :key="'22' + index">
              <td class="tdTwo">{{items.gradeName}}</td>
              <td>{{items.groupMustNumber}}</td>
              <td>{{items.groupFactNumber}}</td>
              <td>{{items.groupRate | numberTrans}}</td>
              <td>{{items.domeMustNumber}}</td>
              <td>{{items.domeFactNumber}}</td>
              <td>{{items.domeRate | numberTrans}}</td>
              <td>{{items.rate | numberTrans}}</td>
            </tr>
            <tr v-if="item.bioLength > 0">
              <td class="tdTwo" v-if="item.phyLength < 1 && item.cheLength < 1 &&item.subLength <= 0" :rowspan="item.lengthOne">{{item.sectionName}}</td>
              <td class="tdTwo" :rowspan="item.biologyData.length">生物</td>
              <td class="tdTwo">{{item.biologyData[0].gradeName}}</td>
              <td>{{item.biologyData[0].groupMustNumber}}</td>
              <td>{{item.biologyData[0].groupFactNumber}}</td>
              <td>{{item.biologyData[0].groupRate | numberTrans}}</td>
              <td>{{item.biologyData[0].domeMustNumber}}</td>
              <td>{{item.biologyData[0].domeFactNumber}}</td>
              <td>{{item.biologyData[0].domeRate | numberTrans}}</td>
              <td>{{item.biologyData[0].rate | numberTrans}}</td>
            </tr>
            <tr v-for="(items,index) in item.biologyData" v-if="index != 0" :key="'33' + index">
              <td class="tdTwo">{{items.gradeName}}</td>
              <td>{{items.groupMustNumber}}</td>
              <td>{{items.groupFactNumber}}</td>
              <td>{{items.groupRate | numberTrans}}</td>
              <td>{{items.domeMustNumber}}</td>
              <td>{{items.domeFactNumber}}</td>
              <td>{{items.domeRate | numberTrans}}</td>
              <td>{{items.rate | numberTrans}}</td>
            </tr>
          </tbody>
        </table>
      </div>
		</div>
</template>

<script>
import { getGradeOpenCount } from "api/count";
import NormalChart from "components/Charts/normalChart";
import YearSelect from "views/components/select/yearSelect";
import TermSelect from "views/components/select/termSelect";
import { scrollTable } from 'src/utils';
export default {
  name: "gradeCount",
  components: { NormalChart, YearSelect, TermSelect },
  data() {
    return {
      searchData: {
        section: null,
        termYear: null,
        term: null
      },
      barTitle: {
        text: "各学段实验达标率",
        left: "center",
        top: "12px",
        textStyle: {
          fontWeight: "bold",
          fontSize: "14"
        }
      },
      subjectName: ["小学", "初中", "高中"],
      learnName: ["科学", "物理", "化学", "生物"],
      chartColor: ["#20A0FF", "#ABCD03", "#e4353c", "#f003ff"],
      subjectData: [],
      list: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getGradeOpenCount(this.searchData).then(res => {
        if (res.totalLists && res.totalLists.length > 0) {
          const t = res.totalLists;
          const s = res.gradeLists;
          var science = {
            subjectId: "1",
            subjectName: "科学",
            groupData: [],
            demoData: []
          };
          var physics = {
            subjectId: "2",
            subjectName: "物理",
            groupData: [],
            demoData: []
          };
          var chemistry = {
            subjectId: "3",
            subjectName: "化学",
            groupData: [],
            demoData: []
          };
          var biology = {
            subjectId: "4",
            subjectName: "生物",
            groupData: [],
            demoData: []
          };
          var vm = this;
          vm.subjectData = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
          if (t && t.length > 0) {
            t.forEach(function(item) {
              if (item.section == "小学") {
                vm.subjectData[0] = [(item.openRate * 100).toFixed(2), 0, 0];
              } else if (item.section == "初中") {
                if (item.subject == "物理") {
                  vm.subjectData[1][1] = (item.openRate * 100).toFixed(2);
                } else if (item.subject == "化学") {
                  vm.subjectData[2][1] = (item.openRate * 100).toFixed(2);
                } else if (item.subject == "生物") {
                  vm.subjectData[3][1] = (item.openRate * 100).toFixed(2);
                }
              } else if (item.section == "高中") {
                if (item.subject == "物理") {
                  vm.subjectData[1][2] = (item.openRate * 100).toFixed(2);
                } else if (item.subject == "化学") {
                  vm.subjectData[2][2] = (item.openRate * 100).toFixed(2);
                } else if (item.subject == "生物") {
                  vm.subjectData[3][2] = (item.openRate * 100).toFixed(2);
                }
              }
            });
          }
          if (s && s.length > 0) {
            var smallSchool = {
              sectionId: "1",
              sectionName: "小学",
              lengthOne: 0,
              subLength: 0,
              phyLength: 0,
              cheLength: 0,
              bioLength: 0,
              subjectData: [],
              physicsData: [],
              chemistryData: [],
              biologyData: []
            };
            var middleSchool = {
              sectionId: "2",
              sectionName: "初中",
              lengthOne: 0,
              subLength: 0,
              phyLength: 0,
              cheLength: 0,
              bioLength: 0,
              subjectData: [],
              physicsData: [],
              chemistryData: [],
              biologyData: []
            };
            var highSchool = {
              sectionId: "3",
              sectionName: "高中",
              lengthOne: 0,
              subLength: 0,
              phyLength: 0,
              cheLength: 0,
              bioLength: 0,
              subjectData: [],
              physicsData: [],
              chemistryData: [],
              biologyData: []
            };
            var vm = this;
            s.forEach(function(item) {
              if (item.learningPeriod == "小学") {
                vm.changeItem(item, smallSchool);
                smallSchool.lengthOne++;
              } else if (item.learningPeriod == "初中") {
                vm.changeItem(item, middleSchool);
                middleSchool.lengthOne++;
              } else if (item.learningPeriod == "高中") {
                vm.changeItem(item, highSchool);
                highSchool.lengthOne++;
              }
            });
            this.list = [smallSchool, middleSchool, highSchool];
          }

          // s.forEach(function(item){
          //  if(item.subjectId == '1'){
          //    item.type == "分组实验"?science.groupData.push(item):science.demoData.push(item);
          //  }else if(item.subjectId == '2'){
          //    item.type == "分组实验"?physics.groupData.push(item):physics.demoData.push(item);
          //  }else if(item.subjectId == '3'){
          //    item.type == "分组实验"?chemistry.groupData.push(item):chemistry.demoData.push(item);
          //  }else if(item.subjectId == '4'){
          //    item.type == "分组实验"?biology.groupData.push(item):biology.demoData.push(item);
          //  }
          // });
          // this.list = [science,physics,chemistry,biology];
        } else {
          this.list = [];
          this.subjectData = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        }
      });
    },
    changeItem(s, t) {
      if (s.subjectId == "1") {
        t.subjectData.push(s);
        t.subLength++;
      } else if (s.subjectId == "2") {
        t.physicsData.push(s);
        t.phyLength++;
      } else if (s.subjectId == "3") {
        t.chemistryData.push(s);
        t.cheLength++;
      } else if (s.subjectId == "4") {
        t.biologyData.push(s);
        t.bioLength++;
      }
    },
    changeYear(year) {
      this.searchData.termYear = year;
      this.getList();
    },
    changeTerm(term) {
      this.searchData.term = term;
      this.getList();
    }
  },
  mounted() {
    scrollTable(null, ".gradeCountTable", true);
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.table-in2 {
  border: 1px solid #eee;
  box-sizing: border-box;
  width: 100%;
  line-height: 36px;
  font-size: 12px;
  text-align: center;
  width: 100%;
  border-collapse: collapse;
  thead {
    background-color: #f4f4f4;
  }
  td {
    border: 1px solid #eee;
    text-align: center;
    padding: 2px 8px;
  }
  tbody tr td.tdTwo {
    text-align: center;
  }
  tr.trOne td {
    text-align: right;
    padding-right: 16px;
  }
  tbody td {
    text-align: right;
    padding-right: 16px;
  }
}
</style>
